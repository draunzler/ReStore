using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Repositories;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<ProductDto>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var products = await _productRepository.GetProductsAsync(productParams);
            
            Response.AddPaginationHeader(products.MetaData);
            
            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                PictureUrl = p.PictureUrl,
                Type = p.Type,
                Brand = p.Brand,
                QuantityInStock = p.QuantityInStock
            }).ToList();

            return Ok(productDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);

            if (product == null) return NotFound();

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                PictureUrl = product.PictureUrl,
                Type = product.Type,
                Brand = product.Brand,
                QuantityInStock = product.QuantityInStock
            };

            return Ok(productDto);
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _productRepository.GetProductBrandsAsync();
            var types = await _productRepository.GetProductTypesAsync();

            return Ok(new { brands, types });
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
        {
            var product = new Product
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                Price = createProductDto.Price,
                PictureUrl = createProductDto.PictureUrl,
                Type = createProductDto.Type,
                Brand = createProductDto.Brand,
                QuantityInStock = createProductDto.QuantityInStock
            };

            var result = await _productRepository.CreateProductAsync(product);

            var productDto = new ProductDto
            {
                Id = result.Id,
                Name = result.Name,
                Description = result.Description,
                Price = result.Price,
                PictureUrl = result.PictureUrl,
                Type = result.Type,
                Brand = result.Brand,
                QuantityInStock = result.QuantityInStock
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(int id, UpdateProductDto updateProductDto)
        {
            var product = await _productRepository.GetProductByIdAsync(id);

            if (product == null) return NotFound();

            product.Name = updateProductDto.Name;
            product.Description = updateProductDto.Description;
            product.Price = updateProductDto.Price;
            product.PictureUrl = updateProductDto.PictureUrl;
            product.Type = updateProductDto.Type;
            product.Brand = updateProductDto.Brand;
            product.QuantityInStock = updateProductDto.QuantityInStock;

            var result = await _productRepository.UpdateProductAsync(product);

            var productDto = new ProductDto
            {
                Id = result.Id,
                Name = result.Name,
                Description = result.Description,
                Price = result.Price,
                PictureUrl = result.PictureUrl,
                Type = result.Type,
                Brand = result.Brand,
                QuantityInStock = result.QuantityInStock
            };

            return Ok(productDto);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var result = await _productRepository.DeleteProductAsync(id);

            if (!result) return NotFound();

            return NoContent();
        }
    }
}