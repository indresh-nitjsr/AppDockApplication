using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.Models;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AppDock.Services.PortfolioAPI.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProjectService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<string> CreateProjectAsync(ProjectDto projectDto)
        {
            if (projectDto == null)
            {
                throw new ArgumentNullException(nameof(projectDto), "Project cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(projectDto.Title))
            {
                throw new ArgumentException("Project name is required.", nameof(projectDto.Title));
            }

            //if (projectDto.StartDate != null && projectDto.EndDate != null && projectDto.StartDate > projectDto.EndDate)
            //{
            //    throw new ArgumentException("Start date cannot be after end date.", nameof(projectDto));
            //}

            try
            {
                bool exists = await _context.projects
                    .Where(p => p.PortfolioId == projectDto.PortfolioId)
                    .AnyAsync(p => p.Title == projectDto.Title); // Checking for duplicates

                if (exists)
                {
                    return $"A project with the name '{projectDto.Title}' already exists.";
                }

                var project = _mapper.Map<Projects>(projectDto);
                if (string.IsNullOrEmpty(project.Id))
                {
                    project.Id = Guid.NewGuid().ToString();
                }

                await _context.projects.AddAsync(project);
                await _context.SaveChangesAsync();

                return $"Project '{project.Title}' created successfully with ID: {project.Id}.";
            }
            catch (DbUpdateException ex)
            {
                // Handle database update exceptions (e.g., constraint violations)
                // You can also log ex details here
                throw new InvalidOperationException("An error occurred while creating the project.", ex);
            }
            catch (Exception ex)
            {
                // Handle other unexpected exceptions
                throw new Exception("Unexpected error occurred while creating the project.", ex);
            }
        }

        public async Task<string> DeleteProjectAsync(string projectId)
        {
            if (string.IsNullOrEmpty(projectId))
            {
                throw new ArgumentException("Project ID cannot be null or empty.", nameof(projectId));
            }
            try
            {
                var project = await _context.projects
                    .FirstOrDefaultAsync(p => p.Id == projectId);

                if (project == null)
                {
                    return $"Project with ID '{projectId}' not found.";
                }

                _context.projects.Remove(project);
                await _context.SaveChangesAsync();

                return $"Project '{project.Title}' (ID: {projectId}) deleted successfully.";
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("A database error occurred while deleting the project.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while deleting the project.", ex);
            }
        }

        public async Task<IEnumerable<ProjectDto>> GetAllProjectsAsync(string portfolioId)
        {
            if (string.IsNullOrWhiteSpace(portfolioId))
            {
                throw new ArgumentException("Portfolio ID cannot be null or empty.", nameof(portfolioId));
            }

            var projects = await _context.projects
                .Where(p => p.PortfolioId == portfolioId)
                .ToListAsync();

            //var projectDtos = _mapper.Map<ICollection<ProjectDto>>(projects);
            //var projectDtos = _mapper.Map<IEnumerable<ProjectDto>>(projects) ?? new List<ProjectDto>();
            var projectDtos = projects.Select(p => new ProjectDto
            {
                ProjectId = p.Id,
                Title = p.Title,
                LiveLink = p.LiveLink,
                RepoLink = p.RepoLink,
                Role = p.Role,
                Description = p.Description,
                TechStack = p.TechStack,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                PortfolioId = p.PortfolioId

                // Map any other fields you have
            }).ToList();

            return projectDtos;
        }

        public async Task<ProjectDto> GetProjectByIdAsync(string projectId)
        {
            if (string.IsNullOrEmpty(projectId))
            {
                throw new ArgumentException("Project ID cannot be null or empty.", nameof(projectId));
            }

            var project = await _context.projects
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
            {
                return null; // or throw, or return a not found response
            }

            var projectDto = _mapper.Map<ProjectDto>(project);
            return projectDto;
        }

        public async Task<string> UpdateProjectAsync(ProjectDto projectDto)
        {
            if (projectDto == null)
            {
                throw new ArgumentNullException(nameof(projectDto), "Project cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(projectDto.Title))
            {
                throw new ArgumentException("Project title is required.", nameof(projectDto.Title));
            }

            try
            {
                // Find existing project by ID
                var existingProject = await _context.projects
                    .Where(p => p.PortfolioId == projectDto.PortfolioId)
                    .FirstOrDefaultAsync(p => p.Id == projectDto.ProjectId);

                if (existingProject == null)
                {
                    return $"Project with ID {projectDto.ProjectId} not found.";
                }

                // Optional: Check for duplicate titles (if needed in your business logic)
                bool duplicateTitle = await _context.projects
                    .AnyAsync(p => p.Title == projectDto.Title && p.Id != projectDto.ProjectId);

                if (duplicateTitle)
                {
                    return $"A project with the title '{projectDto.Title}' already exists.";
                }

                // Map updated fields from DTO to existing entity
                _mapper.Map(projectDto, existingProject);

                _context.projects.Update(existingProject);
                await _context.SaveChangesAsync();

                return $"Project '{existingProject.Title}' updated successfully.";
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("A database error occurred while updating the project.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Unexpected error occurred while updating the project.", ex);
            }
        }

    }
}
