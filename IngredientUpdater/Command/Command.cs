using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using IngredientUpdater.Extensions;
using MongoDB.Driver.Core.Operations;

namespace IngredientUpdater.Command
{
    public abstract class ACommand : ICommand
    {
        protected ACommand(string name, List<object> parameters)
        {
            Name = name;
            Parameters = parameters;
        }

        public string Name { get; }
        public abstract bool Ready();
        public abstract Task Run();
        protected List<object> Parameters { get; }
        protected abstract bool AddParameter(string param);

        public static ACommand Parse(string commandText)
        {
            var parts = commandText.Split(' ');

            if (parts.Length == 0)
                return null;

            var command = CreateCommand(parts[0]);
            if (command == null) return null;

            for (int i = 1; i < parts.Length; i++)
            {
                if (!command.AddParameter(parts[i])) return null;
            }
            return command;
        }

        private static ACommand CreateCommand(string commandText)
        {
            throw new NotImplementedException();
        }
    }
}