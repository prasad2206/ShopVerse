using System.Collections.Generic;

namespace ShopVerse.Models
{
    public class User
    {
        public int Id { get; set; }                     // Primary key
        public string Name { get; set; } = string.Empty; // User name
        public string Email { get; set; } = string.Empty; // User email
        public string PasswordHash { get; set; } = string.Empty; // Hashed password

        // Foreign Key
        public int RoleId { get; set; }                 // Link to Role

        // Navigation Properties
        public Role Role { get; set; } = null!;        // Role navigation
        public ICollection<Order> Orders { get; set; } = new List<Order>(); // User orders
    }
}
