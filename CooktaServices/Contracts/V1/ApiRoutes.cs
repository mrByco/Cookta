using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CooktaServices.Contracts.V1
{
    public static class ApiRoutes
    {
        public const string Root = "api";

        public const string Version = "v1";

        public const string Base = Root + "/" + Version;
        public static class Foods
        {
            public const string GetAll = Base + "/foods";
            public const string Create = Base + "/foods";
            public const string Get = Base + "/foods/{foodId}";
            public const string Update = Base + "/foods/{foodId}";
            public const string Delete = Base + "/foods/{foodId}";
        }

        public static class Users
        {
            public const string Get = Base + "/users/{userId}";
            public const string GetMe = Base + "/users";
            public const string Update = Base + "/users/{userId}";
            public const string CreateUser = Base + "users";
        }
    }
}
