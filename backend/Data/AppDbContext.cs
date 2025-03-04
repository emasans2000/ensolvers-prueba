using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }

    public DbSet<NotesModel> Note { get; set; }
    public DbSet<TagsModel> Tags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
      
        // La relación muchos a muchos se configura de forma implícita en EF Core 5+
        modelBuilder.Entity<NotesModel>()
            .HasMany(n => n.Tags)
            .WithMany(t => t.Note);
    }
}