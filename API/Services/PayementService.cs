using API.Entities;
using Stripe;

namespace API.Services
{
    public class PaymentService
    {
        private readonly IConfiguration _config;

        public PaymentService(IConfiguration config)
        {
            _config = config;

        }

        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            var service = new PaymentIntentService();
            var intent = new PaymentIntent();

            var subtotal = basket.Items.Sum(item => item.Product.Price * item.Quantity);
            var deliveryFee = subtotal > 10000 ? 0 : 500;

            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var option = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,
                    PaymentMethodTypes = new List<string>
                    {
                        "card"
                    },
                    Currency = "gbp"
                };

                intent = await service.CreateAsync(option);

            }
            else
            {
                var option = new PaymentIntentUpdateOptions
                {
                    Amount = subtotal + deliveryFee
                };

                await service.UpdateAsync(basket.PaymentIntentId, option);
            }
            return intent;
        }
    }
}