using API.DTOs;
using API.Entities;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IBasketRepository _basketRepository;

        public AccountController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            ITokenService tokenService,
            IBasketRepository basketRepository)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _basketRepository = basketRepository;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);

            if (user == null) return Unauthorized(new { Message = "Username is invalid" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new { Message = "Password is invalid" });

            await UpdateUserBasket(loginDto.Username);

            return await CreateUserObject(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var userExists = await _userManager.FindByNameAsync(registerDto.Username);
            if (userExists != null)
            {
                return BadRequest(new { Message = "Username is already taken" });
            }

            var emailExists = await _userManager.FindByEmailAsync(registerDto.Email);
            if (emailExists != null)
            {
                return BadRequest(new { Message = "Email is already in use" });
            }

            var user = new User
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Add user to "Member" role
            await _userManager.AddToRoleAsync(user, "Member");

            return await CreateUserObject(user);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            await UpdateUserBasket(user.UserName);
            return await CreateUserObject(user);
        }

        private async Task<UserDto> CreateUserObject(User user)
        {
            var basket = await _basketRepository.GetBasketAsync(user.UserName);

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = _tokenService.GenerateToken(user),
                Username = user.UserName,
                Basket = MapBasketToDto(basket)
            };
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            if (basket == null) return null;

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

        private async Task UpdateUserBasket(string username)
        {
            var buyerId = Request.Cookies["buyerId"];
            
            if (string.IsNullOrEmpty(buyerId)) return;

            var basket = await _basketRepository.GetBasketAsync(buyerId);

            if (basket != null)
            {
                // Transfer anonymous basket to user
                basket.BuyerId = username;
                await _basketRepository.UpdateBasketAsync(basket);
                Response.Cookies.Delete("buyerId");
            }
        }
    }
}