using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppDock.Services.PortfolioAPI.Controllers
{
    [Route("api/about")]
    [Authorize]
    [ApiController]
    public class AboutController : ControllerBase
    {
        private readonly IAboutService _aboutService;
        private readonly ResponseDto _responseDto;

        public AboutController(IAboutService aboutService)
        {
            _aboutService = aboutService;
            _responseDto = new ResponseDto();
        }

        [HttpPost]
        public async Task<IActionResult> AddOrUpdateAbout([FromBody] AboutDto aboutDto)
        {
            var result = await _aboutService.AddOrUpdateAboutAsync(aboutDto);

            if (result.StartsWith("Failed"))
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = result;
                return BadRequest(_responseDto);
            }

            _responseDto.Message = result;
            return Ok(_responseDto);
        }

        [HttpGet("{portfolioId}")]
        public async Task<IActionResult> GetAbout(int portfolioId)
        {
            var about = await _aboutService.GetAboutAsync(portfolioId);
            if (about == null)
            {
                return NotFound();
            }

            _responseDto.Results = about;
            return Ok(_responseDto);
        }
    }
}
