namespace ShopVerse.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        // Foreign Key
        public int RoleId { get; set; }

        // Navigation Properties
        public Role Role { get; set; }
        public ICollection<Order> Orders { get; set; }
    }
}
