using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/notes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotesModel>>> GetNotes()
        {
            return await _context.Note.Include(n => n.Tags).ToListAsync();
        }

        // GET: api/notes/active
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<NotesModel>>> GetActiveNotes()
        {
            var note = await _context.Note
                .Where(n => !n.IsDeleted)
                .Include(n => n.Tags)
                .ToListAsync();
            return note;
        }

        // GET: api/notes/archived
        [HttpGet("archived")]
        public async Task<ActionResult<IEnumerable<NotesModel>>> GetArchivedNotes()
        {
            var note = await _context.Note
                .Where(n => n.IsDeleted)
                .Include(n => n.Tags)
                .ToListAsync();
            return note;
        }

        // GET: api/notes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NotesModel>> GetNote(int id)
        {
            var note = await _context.Note
                .Include(n => n.Tags)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (note == null)
            {
                return NotFound();
            }

            return note;
        }

        // POST: api/notes
        [HttpPost]
        public async Task<ActionResult<NotesModel>> CreateNote(NotesModel note)
        {
            note.CreatedAt = DateTime.UtcNow;
            note.UpdatedAt = DateTime.UtcNow;
            note.IsDeleted = false;
            note.Content = note.Content;
            note.Tags = new List<TagsModel>();
        
            
            _context.Note.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNote), new { id = note.Id }, note);
        }

        // PUT: api/notes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, NotesModel note)
        {
            if (id != note.Id)
            {
                return BadRequest();
            }

            note.UpdatedAt = DateTime.UtcNow;
            _context.Entry(note).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NoteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/notes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Note.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }

            _context.Note.Remove(note);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/notes/{id}/archive
        [HttpPut("{id}/archive")]
        public async Task<IActionResult> ArchiveNote(int id)
        {
            var note = await _context.Note.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }

            note.IsDeleted = true;
            note.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/notes/{id}/unarchive
        [HttpPut("{id}/unarchive")]
        public async Task<IActionResult> UnarchiveNote(int id)
        {
            var note = await _context.Note.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }

            note.IsDeleted = false;
            note.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/notes/{noteId}/tags
        // Permite agregar una etiqueta a una nota. Si la etiqueta ya existe en la BD, la reutiliza.
        [HttpPost("{noteId}/tags")]
        public async Task<IActionResult> AddTagToNote(int noteId, [FromBody] TagsModel tag)
        {
            var note = await _context.Note.Include(n => n.Tags).FirstOrDefaultAsync(n => n.Id == noteId);
            if (note == null)
            {
                return NotFound();
            }

            // Buscar si ya existe la etiqueta por nombre
            var existingTag = await _context.Tags.FirstOrDefaultAsync(t => t.Name == tag.Name);
            if (existingTag != null)
            {
                if (!note.Tags.Any(t => t.Id == existingTag.Id))
                {
                    note.Tags.Add(existingTag);
                }
            }
            else
            {
                note.Tags.Add(tag);
            }

            note.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/notes/{noteId}/tags/{tagId}
        // Permite eliminar una etiqueta de una nota
        [HttpDelete("{noteId}/tags/{tagId}")]
        public async Task<IActionResult> RemoveTagFromNote(int noteId, int tagId)
        {
            var note = await _context.Note.Include(n => n.Tags).FirstOrDefaultAsync(n => n.Id == noteId);
            if (note == null)
            {
                return NotFound();
            }

            var tag = note.Tags.FirstOrDefault(t => t.Id == tagId);
            if (tag == null)
            {
                return NotFound();
            }

            note.Tags.Remove(tag);
            note.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool NoteExists(int id)
        {
            return _context.Note.Any(e => e.Id == id);
        }
    }
}
