using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppDock.Services.PortfolioAPI.Controllers
{
    [Route("api/experience")]
    [ApiController]
    public class ExperienceController : ControllerBase
    {
        private readonly IExperienceService _experienceService;

        public ExperienceController(IExperienceService experienceService)
        {
            _experienceService = experienceService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateExperience([FromBody] ExperienceDto experienceDto)
        {
            if (experienceDto == null)
            {
                return BadRequest("experience is required.");
            }
            try
            {
                var resultMessage = await _experienceService.CreateExperienceAsync(experienceDto);
                return Ok(new { message = resultMessage });
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while creating the experience.");
            }
        }

        [HttpGet("portfolioId")]
        public async Task<IActionResult> GetExperiences(string portfolioId)
        {
            if (string.IsNullOrWhiteSpace(portfolioId))
            {
                return BadRequest("Portfolio ID is required.");
            }

            try
            {
                var experiences = await _experienceService.GetAllExperienceAsync(portfolioId);

                if (experiences == null || !experiences.Any())
                {
                    return NotFound("No Experiences found for the specified Portfolio ID.");
                }

                return Ok(experiences);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving Experience.");
            }
        }


        [HttpPut]
        public async Task<IActionResult> UpdateExperience([FromBody] ExperienceDto experienceDto)
        {
            if (experienceDto == null)
            {
                return BadRequest("Experience data is required.");
            }
            try
            {
                var resultMessage = await _experienceService.UpdateExperienceAsync(experienceDto);
                return Ok(new { message = resultMessage });
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while creating the Experience.");
            }
        }

        [HttpDelete("{experienceId}")]
        public async Task<IActionResult> DeleteExperience(string experienceId)
        {
            if (string.IsNullOrWhiteSpace(experienceId))
            {
                return BadRequest("Experience ID is required.");
            }

            try
            {
                var resultMessage = await _experienceService.DeleteExperienceAsync(experienceId);

                if (resultMessage.Contains("not found", StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(resultMessage);
                }

                return Ok(new { message = resultMessage });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while deleting the Experience.");
            }
        }

        [HttpGet("{experienceId}")]
        public async Task<IActionResult> GetExperiencecById(string experienceId)
        {
            if (string.IsNullOrWhiteSpace(experienceId))
            {
                return BadRequest("Experience ID is required.");
            }

            try
            {
                var experienceDto = await _experienceService.GetExperienceByIdAsync(experienceId);

                if (experienceDto == null)
                {
                    return NotFound($"Experience with ID '{experienceId}' not found.");
                }

                return Ok(experienceDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving the Experience.");
            }
        }

    }
}
