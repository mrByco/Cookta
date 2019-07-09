using Kukta.Calendar;
using Kukta.FrameWork;
using Kukta.Menu;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class CalendarPage : Page
    {
        public CalendarPage()
        {
            this.InitializeComponent();
        }
        public List<CalendarDay> CalendarDays = new List<CalendarDay>();
        //public List<Tuple<EMealType, List<Tuple<DateTime, List<IMealingItem>>>>> MealsOfWeek = new List<Tuple<EMealType, List<Tuple<DateTime, List<IMealingItem>>>>>();

        private ObservableCollection<Screens.Calendar.MealDayList> mealsAndDays = new ObservableCollection<Screens.Calendar.MealDayList>();
        private void UpdateDays(List<CalendarDay> days)
        {
            CalendarDays = days;
        }
    }
}
namespace Kukta.Screens.Calendar
{
    internal class MealDayList
    {
        internal ObservableCollection<CalendarMeal> meals = new ObservableCollection<CalendarMeal>();
        internal EMealType type;
        internal MealDayList(List<CalendarDay> days, EMealType type)
        {
            meals = new ObservableCollection<CalendarMeal>();
            foreach (CalendarDay day in days)
            {
                meals.Add(new CalendarMeal(day, type));
            }
            this.type = type;
        }
    }
    internal class CalendarMeal
    {
        internal ObservableCollection<IMealingItem> items = new ObservableCollection<IMealingItem>();
        internal DateTime date;
        internal CalendarMeal (CalendarDay day, EMealType type)
        {
            items = new ObservableCollection<IMealingItem>(day.GetItemsOf(type));
            date = day.DateTime.CutToDay();
        }
    }
}
