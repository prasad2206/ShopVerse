namespace ShopVerse.DTOs
{
    public class OrderDto
    {
        public int UserId { get; set; } // Customer Id
        public decimal TotalAmount { get; set; } // Order total
        public List<OrderItemDto> Items { get; set; } = new(); // Order items
    }
}
