using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class TagsModel
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    // Relación inversa muchos a muchos con Notas
    // Ignorar la propiedad de navegación durante la serialización
    [JsonIgnore]
    public ICollection<NotesModel> Note { get; set; } = new List<NotesModel>();
}