using Kukta.Calendar;
using Kukta.Menu;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Controls;

namespace Kukta.FrameWork
{
    public class WeekTemplateCombobox : ComboBox
    {
        public CalendarDay day;

        private Dictionary<int, WeekTemplate> indexItemMap = new Dictionary<int, WeekTemplate>();

        public WeekTemplateCombobox(CalendarDay calendarDay) : base()
        {
            day = calendarDay;
            RefreshCombobox();
            TemplateManager.Instance.OnTemplatesChanged += RefreshCombobox;
            base.SelectionChanged += OnSelectionChanged;
        }

        private void OnSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            try
            {
                day.AttachToTemplate(indexItemMap[base.SelectedIndex]);
            }
            catch { }
        }

        private void RefreshCombobox()
        {
            indexItemMap = new Dictionary<int, WeekTemplate>();
            base.Items.Clear();
            int i = 0;
            foreach (WeekTemplate template in TemplateManager.Instance.GetTemplates())
            {
                base.Items.Add(new TextBlock() { Text = template.TemplateName });
                indexItemMap.Add(i, template);
                if (template.guid == day.GetTemplateGuid())
                    base.SelectedIndex = i;
                i++;
            }
        }


    }
}
