using System.Collections.Generic;

namespace ShopVerse.Models
{
    public class Role
    {
        public int Id { get; set; }                     // Primary key
        public string Name { get; set; } = string.Empty; // Role name

        // Navigation property
        public ICollection<User> Users { get; set; } = new List<User>(); // Users in role
    }
}
