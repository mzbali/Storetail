namespace API.DTOs
{
    public class BasketDto
    {
        public int BasketId { get; set; }
        public string BuyerId { get; set; } = default!;
        public List<BasketItemDto> Items { get; set; } = new(); // new DTOs to avoid cycle object
        public string PaymentIntentId { get; set; } = default!;
        public string ClientSecret { get; set; } = default!;
    }
}