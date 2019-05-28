using Kukta.FoodFramework;
using Kukta.FrameWork;
using Kukta.SaveLoad.File;
using Kukta.SaveLoad.File.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    class TemplateManager : ASingleton<TemplateManager>
    {
        public VoidDelegate OnTemplatesChanged;

        private List<WeekTemplate> m_WeekTempltates = new List<WeekTemplate>();

        public TemplateManager()
        {
            //Inint sample templates
        }

        public List<WeekTemplate> GetTemplates()
        {
            return m_WeekTempltates;
        }
        public void AddTemplate(WeekTemplate template)
        {
            m_WeekTempltates.Add(template);
            SaveTemplate(template);
            OnTemplatesChanged?.Invoke();
        }
        public void RemoveTemplate(WeekTemplate template)
        {
            m_WeekTempltates.Remove(template);
            OnTemplatesChanged?.Invoke();
            FileManager.AddTask(new DeleteSerializableFile(App.TemplateRoot, template.GetFileName()));
        }

        internal WeekTemplate GetTemplate(Guid weekTemplateGuid)
        {
            return m_WeekTempltates.Find(t => t.guid == weekTemplateGuid);
        }

        internal void SaveTemplate(WeekTemplate template)
        {
            FileManager.AddTask(new SaveSerializable(App.TemplateRoot, template));
        }
        internal void SaveTemplate(WeekTemplate template, string oldName)
        {
            FileManager.AddTask(new SaveSerializable(App.TemplateRoot, template, oldName));
        }

        internal void LoadTemplates()
        {
            FileManager.AddTask(new LoadAllSerializableFromFolder<WeekTemplate, WeekTemplateData>(App.TemplateRoot, (templates) => 
            {
                m_WeekTempltates = templates;
                OnTemplatesChanged?.Invoke();
            }));
        }
    }
}
