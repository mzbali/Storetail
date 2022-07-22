namespace API.DTOs
{
    public class BasketItemDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = default!;
        public long Price { get; set; } = default!;
        public string PictureUrl { get; set; } = default!;
        public string Type { get; set; } = default!;
        public string Brand { get; set; } = default!;
        public int Quantity { get; set; } = default!; // to show how much in one basket
    }
}