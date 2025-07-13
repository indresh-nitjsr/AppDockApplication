using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppDock.Services.PortfolioAPI.Controllers
{
    [Route("api/skill")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private readonly ISkillService _skillService;
        public SkillController(ISkillService skillService)
        {
            _skillService = skillService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSkill([FromBody] SkillDto skillDto)
        {
            if (skillDto == null)
            {
                return BadRequest("Skill is required.");
            }
            try
            {
                var resultMessage = await _skillService.CreateSkillAsync(skillDto);
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
                return StatusCode(500, "An error occurred while creating the skill.");
            }
        }

        [HttpGet("portfolio/{portfolioId}")]
        public async Task<IActionResult> GetSkills(string portfolioId)
        {
            if (string.IsNullOrWhiteSpace(portfolioId))
            {
                return BadRequest("Portfolio ID is required.");
            }

            try
            {
                var skills = await _skillService.GetAllSkillAsync(portfolioId);

                if (skills == null || !skills.Any())
                {
                    return NotFound("No skills found for the specified Portfolio ID.");
                }

                return Ok(skills);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving skill.");
            }
        }


        [HttpPut]
        public async Task<IActionResult> UpdateProject([FromBody] SkillDto skillDto)
        {
            if (skillDto == null)
            {
                return BadRequest("Skill data is required.");
            }
            try
            {
                var resultMessage = await _skillService.UpdateSkillAsync(skillDto);
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
                return StatusCode(500, "An error occurred while creating the skill.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkills(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Skill ID is required.");
            }

            try
            {
                var resultMessage = await _skillService.DeleteSkillAsync(id);

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
                return StatusCode(500, "An error occurred while deleting the skill.");
            }
        }

        [HttpGet("{skillId}")]
        public async Task<IActionResult> GetSkillById(string skillId)
        {
            if (string.IsNullOrWhiteSpace(skillId))
            {
                return BadRequest("Skill ID is required.");
            }

            try
            {
                var skillDto = await _skillService.GetSkillByIdAsync(skillId);

                if (skillDto == null)
                {
                    return NotFound($"Skill with ID '{skillId}' not found.");
                }

                return Ok(skillDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving the skill.");
            }
        }
    }
}
