namespace ShopVerse.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }

        // Foreign Key
        public int UserId { get; set; }

        // Navigation Properties
        public User User { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
