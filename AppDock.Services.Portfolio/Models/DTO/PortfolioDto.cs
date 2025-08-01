﻿using System.ComponentModel.DataAnnotations;

namespace AppDock.Services.PortfolioAPI.Models.DTO
{
    public class PortfolioDto
    {
        public string Role { get; set; }
        [DataType(DataType.Date)]
        public DateTime DOB { get; set; }
    }
}
