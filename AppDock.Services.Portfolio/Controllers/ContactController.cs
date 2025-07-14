using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppDock.Services.PortfolioAPI.Controllers
{
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;
        private readonly ResponseDto _responseDto;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
            _responseDto = new ResponseDto();
        }

        [HttpPost]
        public async Task<IActionResult> AddOrUpdateContact([FromBody] ContactDto contactDto)
        {
            var result = await _contactService.AddOrUpdateContactAsync(contactDto);

            if (result.StartsWith("Failed"))
            {
                _responseDto.isSuccess = false;
                _responseDto.Message = result;
                return BadRequest(_responseDto);
            }

            _responseDto.Message = result;
            return Ok(_responseDto);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetContact(string userId)
        {
            var contact = await _contactService.GetContactAsync(userId);
           
            _responseDto.Results = contact;
            return Ok(_responseDto);
        }
        }
}
