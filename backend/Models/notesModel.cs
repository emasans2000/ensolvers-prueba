using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class NotesModel
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Title { get; set; }
    
    public string Content { get; set; }
    
    public bool IsDeleted { get; set; }

    public bool IsComplete { get; set; }

    public ICollection<TagsModel> Tags { get; set; } = new List<TagsModel>();
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
}