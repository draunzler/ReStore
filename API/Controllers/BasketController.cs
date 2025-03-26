using API.DTOs;
using API.Entities;
using API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController : ControllerBase
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IProductRepository _productRepository;

        public BasketController(IBasketRepository basketRepository, IProductRepository productRepository)
        {
            _basketRepository = basketRepository;
            _productRepository = productRepository;
        }

        [HttpGet]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var buyerId = Request.Cookies["buyerId"];

            if (string.IsNullOrEmpty(buyerId))
            {
                return NotFound();
            }

            var basket = await _basketRepository.GetBasketAsync(buyerId);

            if (basket == null) return NotFound();

            return MapBasketToDto(basket);
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            if (basket == null) basket = await CreateBasket();

            var product = await _productRepository.GetProductByIdAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails{Title = "Product not found"});

            basket.AddItem(product, quantity);

            var result = await _basketRepository.UpdateBasketAsync(basket);

            return MapBasketToDto(result);
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);

            if (basket.Items.Count == 0) 
            {
                await _basketRepository.DeleteBasketAsync(basket.Id);
                Response.Cookies.Delete("buyerId");
                return Ok();
            }

            var result = await _basketRepository.UpdateBasketAsync(basket);
            
            return Ok(MapBasketToDto(result));
        }

        private async Task<Basket> RetrieveBasket()
        {
            var buyerId = Request.Cookies["buyerId"];
            if (string.IsNullOrEmpty(buyerId)) return null;
            
            return await _basketRepository.GetBasketAsync(buyerId);
        }

        private async Task<Basket> CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            
            return await _basketRepository.CreateBasketAsync(buyerId);
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList(),
                ClientSecret = basket.ClientSecret,
                PaymentIntentId = basket.PaymentIntentId
            };
        }
    }
}