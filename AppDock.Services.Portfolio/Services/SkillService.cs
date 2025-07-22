using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.Models;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AppDock.Services.PortfolioAPI.Services
{
    public class SkillService : ISkillService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public SkillService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<string> CreateSkillAsync(SkillDto skillDto)
        {
            if (skillDto == null)
            {
                throw new ArgumentNullException(nameof(skillDto), "Skills cannot be null.");
            }
            try
            {
                bool exists = await _context.skills
                    .Where(p => p.PortfolioId == skillDto.PortfolioId)
                    .AnyAsync(p => p.Skills == skillDto.Skills); 

                if (exists)
                {
                    return $"skills with the name '{skillDto.Skills}' already exists.";
                }
                var config = new MapperConfiguration(cfg =>
                {
                    cfg.CreateMap<SkillDto, Skill>();
                });
                var mapper = config.CreateMapper();
                var skill = mapper.Map<Skill>(skillDto);

                if (string.IsNullOrEmpty(skill.Id))
                {
                    skill.Id = Guid.NewGuid().ToString();
                }

                await _context.skills.AddAsync(skill);
                await _context.SaveChangesAsync();

                return $"Skill created successfully with ID: {skill.Id}.";
            }
            catch (DbUpdateException ex)
            {
              
                throw new InvalidOperationException("An error occurred while creating the skill.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Unexpected error occurred while creating the skill.", ex);
            }
        }

        public async Task<IEnumerable<SkillDto>> GetAllSkillAsync(string portfolioId)
        {
            if (string.IsNullOrWhiteSpace(portfolioId))
            {
                throw new ArgumentException("Portfolio ID cannot be null or empty.", nameof(portfolioId));
            }

            try
            {
                var skills = await _context.skills
                    .Where(s => s.PortfolioId == portfolioId)
                    .ToListAsync();

                var config = new MapperConfiguration(cfg =>
                {
                    cfg.CreateMap<Skill, SkillDto>()
                        .ForMember(dest => dest.SkillId, opt => opt.MapFrom(src => src.Id));
                });
                var localMapper = config.CreateMapper();

                var skillDtos = localMapper.Map<IEnumerable<SkillDto>>(skills) ?? new List<SkillDto>();

                return skillDtos;
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("A database error occurred while retrieving skills.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while retrieving skills.", ex);
            }
        }

        public async Task<string> UpdateSkillAsync(SkillDto skillDto)
        {
            if (skillDto == null)
            {
                throw new ArgumentNullException(nameof(skillDto), "skill cannot be null.");
            }

            try
            {
                var existingSkill = await _context.skills
                    .Where(s => s.PortfolioId == skillDto.PortfolioId)
                    .FirstOrDefaultAsync(s => s.Id == skillDto.SkillId);

                if (existingSkill == null)
                {
                    return $"skill with ID {skillDto.SkillId} not found.";
                }
                existingSkill.Skills = skillDto.Skills;
                existingSkill.proficiency = skillDto.Proficiency;
                _context.skills.Update(existingSkill);
                await _context.SaveChangesAsync();

                return $"Skill updated successfully.";
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("A database error occurred while updating the skill.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Unexpected error occurred while updating the skill.", ex);
            }
        }

        public async Task<string> DeleteSkillAsync(string skillId)
        {
            if (string.IsNullOrEmpty(skillId))
            {
                throw new ArgumentException("Skill ID cannot be null or empty.", nameof(skillId));
            }
            try
            {
                var skill = await _context.skills
                    .FirstOrDefaultAsync(s => s.Id == skillId);

                if (skill == null)
                {
                    return $"Skill with ID '{skillId}' not found.";
                }

                _context.skills.Remove(skill); 
                await _context.SaveChangesAsync();

                return $"Skill with ID: {skillId} deleted successfully.";
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("A database error occurred while deleting the skill.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while deleting the skill.", ex);
            }
        }

        public async Task<SkillDto> GetSkillByIdAsync(string skillId)
        {
            if (string.IsNullOrEmpty(skillId))
            {
                throw new ArgumentException("Skill ID cannot be null or empty.", nameof(skillId));
            }

            try
            {
                var skill = await _context.skills
                    .FirstOrDefaultAsync(s => s.Id == skillId);

                if (skill == null)
                {
                    return null;
                }
                var skillDto = new SkillDto
                {
                    SkillId = skill.Id,
                    PortfolioId = skill.PortfolioId,
                    Skills = skill.Skills,
                    Proficiency = skill.proficiency
                };

                return skillDto;
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("A database error occurred while retrieving the skill.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while retrieving the skill.", ex);
            }
        }
    }
}
