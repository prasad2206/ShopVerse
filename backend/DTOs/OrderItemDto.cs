namespace ShopVerse.DTOs
{
    public class OrderItemDto
    {
        public int ProductId { get; set; } // Product id
        public int Quantity { get; set; } // Qty
        public decimal UnitPrice { get; set; } // Price
    }
}
