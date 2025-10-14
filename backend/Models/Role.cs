namespace ShopVerse.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Navigation Property
        public ICollection<User> Users { get; set; }
    }
}
