using Kukta.Calendar;
using Kukta.FoodFrameworkV2;
using Kukta.UI;
using Kukta.Menu;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.UI.Core;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Kukta.FrameWork;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class CalendarContentPage : Page
    {
        private Dictionary<EMealType, int> RowByMealType = new Dictionary<EMealType, int>();
        // -1 is alvays the Mealtypes
        private Dictionary<int, List<UIElement>> ElementsByDayindex = new Dictionary<int, List<UIElement>>();

        private CalendarDay[] days = new CalendarDay[7];

        public CalendarContentPage()
        {
            this.InitializeComponent();
            DrawMeals(Enum.GetValues(typeof(EMealType)).Cast<EMealType>().ToList());
        }

        protected async void OnNavigatedTo(DateTime e)
        {
            DateTime startDay = e.StartOfWeek(DayOfWeek.Monday);
            DrawMeals(Enum.GetValues(typeof(EMealType)).Cast<EMealType>().ToList());
#pragma warning disable CS4014 
            Task.Run( () => { DrawAllDays(startDay); });
#pragma warning restore CS4014
        }
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            OnNavigatedTo((DateTime)e.Parameter);
        }
        private async Task DrawAllDays(DateTime startDay)
        {
            await SetLoading(true);
            for (int i = 0; i < 7; i++)
            {
                DrawDay(await CalendarDay.GetDay(startDay.AddDays(i).CutToDay()));
            }
            await SetLoading(false);
        }

        private void DrawMeals(List<EMealType> meals)
        {
            try
            {
                if (ElementsByDayindex.ContainsKey(-1))
                {
                    ElementsByDayindex[-1].ForEach((element) => ContentGrid.Children.Remove(element));
                    ElementsByDayindex.Remove(-1);
                }
            }
            catch
            {
            }
            ElementsByDayindex.Add(-1, new List<UIElement>());
            RowByMealType = new Dictionary<EMealType, int>();
            foreach (EMealType type in meals)
            {
                TextBlock TextBlock = new TextBlock();
                ContentGrid.Children.Add(TextBlock);
                ElementsByDayindex[-1].Add(TextBlock);
                TextBlock.Text = type.ToString();
                TextBlock.VerticalAlignment = VerticalAlignment.Center;
                TextBlock.HorizontalAlignment = HorizontalAlignment.Center;
                //Make grid row if not exist
                if (ContentGrid.RowDefinitions.Count <= meals.Count + 1)
                {
                    RowDefinition row = new RowDefinition
                    {
                        Height = new GridLength(1, GridUnitType.Auto),
                        MinHeight = 40.0
                    };
                    ContentGrid.RowDefinitions.Add(row);
                }
                Grid.SetRow(TextBlock, (int)type + 2);
                RowByMealType.Add(type, (int)type + 2);

            }
        }

        private async void DrawDay(CalendarDay day)
        {
            int dayIndex = day.DateTime.DayIndexInWeek(DayOfWeek.Monday) + 1;
            if (dayIndex >= 0)
            {
                days[dayIndex - 1] = day;
            }
            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                if (ElementsByDayindex.ContainsKey(dayIndex))
                {
                    List<UIElement> elements = ElementsByDayindex[dayIndex];
                    if (elements != null)
                        elements.ForEach(e => { ContentGrid.Children.Remove(e); });
                }
                if (ElementsByDayindex.ContainsKey(dayIndex))
                    ElementsByDayindex[dayIndex] = new List<UIElement>();
                else
                    ElementsByDayindex.Add(dayIndex, new List<UIElement>());

                TextBlock dayText = new TextBlock()
                {
                    Text = day.DateTime.DayOfWeek.ToString()
                };
                ElementsByDayindex[dayIndex].Add(dayText);
                ContentGrid.Children.Add(dayText);
                Grid.SetColumn(dayText, dayIndex);





                if (day == null)
                {
                    ProgressRing ring = new ProgressRing();
                    ring.IsActive = true;
                    ElementsByDayindex[day.DateTime.DayIndexInWeek(DayOfWeek.Monday)].Add(ring);
                    ContentGrid.Children.Add(ring);
                    return;
                }

                foreach (EMealType type in RowByMealType.Keys)
                {
                    StackPanel itemList = new StackPanel();

                    if (day.GetItemsOf(type).Count > 0)
                    {
                        for (int i = 0; i < day.GetItemsOf(type).Count; i++)
                        {
                            itemList.Children.Add(new CalendarButton(ref day.GetMealing(type), ref day, i, FlyoutMenu, DrawDay, itemList, false));
                        }
                    }
                    else
                    {
                        itemList.Children.Add(new CalendarButton(ref day.GetMealing(type), ref day, null, FlyoutMenu, DrawDay, itemList, false));
                    }

                    Grid.SetColumn(itemList, dayIndex);
                    Grid.SetRow(itemList, RowByMealType[type]);
                    ContentGrid.Children.Add(itemList);
                    ElementsByDayindex[dayIndex].Add(itemList);
                }
            });
        }
        private async Task SetLoading(bool Loading)
        {
            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                LoadingProgressRing.Visibility = Loading ? Visibility.Visible : Visibility.Collapsed;
                ContentScroll.Visibility = Loading ? Visibility.Collapsed : Visibility.Visible;
            });
        }

        internal static void AddNewMealingItemToStack(StackPanel panel, ref Mealing mealing, ref CalendarDay day, MenuFlyout flyout, Action<CalendarDay> refreshDay)
        {
            CalendarButton button = new CalendarButton(ref mealing, ref day, null, flyout, refreshDay, panel, true);
            panel.Children.Add(button);
        }
    }
}
