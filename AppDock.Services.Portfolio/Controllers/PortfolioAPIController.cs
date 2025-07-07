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

        //Portfolio CRUD start

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

        [HttpPut]
        public async Task<IActionResult> UpdatePortfolio([FromBody] PortfolioDto user)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var message = await _portfolioService.UpdatePortfolioAsync(user, email);

            if (string.IsNullOrEmpty(message) || message.StartsWith("Failed"))
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = message;
                return BadRequest(_responseDto);
            }

            _responseDto.Message = message;
            return Ok(_responseDto);
        }

        [HttpGet("{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPortfolioDetailsAsync(string userId)
        {
            //var email = User.FindFirstValue(ClaimTypes.Email);
            PortfolioDetailsDto portfolioDetails = await _portfolioService.GetPortfolioDetailsAsync(userId);
            if (portfolioDetails == null)
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = "No portfolios found.";
                return NotFound(_responseDto);
            }
            //_responseDto.Results = portfolios;
            return Ok(portfolioDetails);
        }   

    }
}
