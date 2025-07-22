using AppDock.Services.PortfolioAPI.ExternalServices.IExternalServices;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AppDock.Services.PortfolioAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/portfolio")]
    public class PortfolioAPIController : ControllerBase
    {
        private readonly IPortfolioService _portfolioService;
        protected ResponseDto _responseDto;
        private readonly IAuthService _authService;
        public PortfolioAPIController(IPortfolioService portfolioService, IAuthService authService)
        {
            _portfolioService = portfolioService;
            _responseDto = new ResponseDto();
            _authService = authService;
        }

        //create portfolio
        [HttpPost]
        public async Task<IActionResult> CreatePortfolio([FromBody] PortfolioDto portfolio)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var message = await _portfolioService.CreatePortfolioAsync(portfolio, email);

            if (string.IsNullOrEmpty(message) || message.StartsWith("Failed"))
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = message;
                return BadRequest(_responseDto);
            }

            _responseDto.Message = message;
            return Ok(_responseDto);
        }

        // update portfolio
        [HttpPut]
        public async Task<IActionResult> UpdatePortfolio([FromBody] PortfolioDto portfolioDto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var message = await _portfolioService.UpdatePortfolioAsync(portfolioDto, email);

            if (string.IsNullOrEmpty(message) || message.StartsWith("Failed"))
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = message;
                return BadRequest(_responseDto);
            }

            _responseDto.Message = message;
            return Ok(_responseDto);
        }
           
        //get portfolio details
        [HttpGet("{portfolioId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPortfolioDetailsAsync(string portfolioId)
        {
            PortfolioDetailsDto portfolioDetails = await _portfolioService.GetPortfolioDetailsAsync(portfolioId);

            if (portfolioDetails == null)
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = "No portfolios found.";
                return NotFound(_responseDto);
            }

            if (portfolioDetails.Id == null)
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = "Portfolio ID is missing.";
                return NotFound(_responseDto);
            }

            return Ok(portfolioDetails);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPortfolioDetailsAsync(string userId)
        {
            PortfolioDetailsDto portfolioDetails = await _portfolioService.GetUserPortfolioDetailsAsync(userId);

            if (portfolioDetails == null)
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = "No portfolios found.";
                return NotFound(_responseDto);
            }

            if (portfolioDetails.Id == null)
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = "Portfolio not found.";
                return NotFound(_responseDto);
            }

            return Ok(portfolioDetails);
        }
    }
}
