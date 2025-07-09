using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppDock.Services.PortfolioAPI.Controllers
{
    [Route("api/project")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects(string portfolioId)
        {
            if (string.IsNullOrWhiteSpace(portfolioId))
            {
                return BadRequest("Portfolio ID is required.");
            }

            try
            {
                var projects = await _projectService.GetAllProjectsAsync(portfolioId);

                if (projects == null || !projects.Any())
                {
                    return NotFound("No projects found for the specified Portfolio ID.");
                }

                return Ok(projects);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving projects.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDto projectDto)
        {
            if (projectDto == null)
            {
                return BadRequest("Project data is required.");
            }
            try
            {
                var resultMessage = await _projectService.CreateProjectAsync(projectDto);
                return Ok(new { message = resultMessage });
            }
            catch (ArgumentNullException ex)
            {
                // Handles null project DTO thrown by service
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                // Handles invalid fields in DTO if validated inside service
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // Unexpected error
                return StatusCode(500, "An error occurred while creating the project.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProject([FromBody] ProjectDto projectDto)
        {
            if (projectDto == null)
            {
                return BadRequest("Project data is required.");
            }
            try
            {
                var resultMessage = await _projectService.UpdateProjectAsync(projectDto);
                return Ok(new { message = resultMessage });
            }
            catch (ArgumentNullException ex)
            {
                // Handles null project DTO thrown by service
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                // Handles invalid fields in DTO if validated inside service
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // Unexpected error
                return StatusCode(500, "An error occurred while creating the project.");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProject(string id)
        {
            return Ok(new { message = $"Project with ID {id} deleted successfully." });
        }

        [HttpGet("{id}")]
        public IActionResult GetProjectById(string id)
        {
            return Ok(new { message = $"Project with ID {id} will be returned here." });
        }
    }
}
