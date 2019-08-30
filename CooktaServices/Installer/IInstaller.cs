﻿using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace CooktaServices
{
    public interface IInstaller
    {
        void InstallServices(IServiceCollection services, IConfiguration config);

    }
}
