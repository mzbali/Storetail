namespace API.Entities.OrderAggregate
{
    public class OrderItem
    {
        public int Id { get; set; }
        public ProductItemOrdered Product { get; set; } = default!;
        public long Price { get; set; }
        public int Quantity { get; set; }
    }
}