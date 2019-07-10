using Kukta.Calendar;
using Kukta.FoodFrameworkV2;
using Kukta.FrameWork;
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
        private DateTime CurrentDate;
        private FrameworkElement lastClicked;
        private StackPanel lastClickedStack;

        private CalendarDay[] days = new CalendarDay[7];

        public CalendarContentPage()
        {
            this.InitializeComponent();
            DrawMeals(Enum.GetValues(typeof(EMealType)).Cast<EMealType>().ToList());
        }

#pragma warning disable CS0628 // New protected member declared in sealed class
        protected async void OnNavigatedTo(DateTime e)
#pragma warning restore CS0628 // New protected member declared in sealed class
        {
            DateTime startDay = e.StartOfWeek(DayOfWeek.Monday);
            CurrentDate = startDay;
            DrawMeals(Enum.GetValues(typeof(EMealType)).Cast<EMealType>().ToList());
            for (int i = 0; i < 7; i++)
            {
                DrawDay(await CalendarDay.GetDay(startDay.AddDays(i).CutToDay()));
            }
        }
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            OnNavigatedTo((DateTime)e.Parameter);
        }

        private void DrawMeals(List<EMealType> meals)
        {
            try
            {
                ElementsByDayindex[-1].ForEach((element) => ContentGrid.Children.Remove(element));
                ElementsByDayindex.Remove(-1);
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
            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                int dayIndex = day.DateTime.DayIndexInWeek(DayOfWeek.Monday) + 1;
                try
                {
                    List<UIElement> elements = ElementsByDayindex[dayIndex];
                    if (elements != null)
                        elements.ForEach(e => { ContentGrid.Children.Remove(e); });
                }
                catch
                {
                }
                if (dayIndex >= 0)
                {
                    days[dayIndex] = day;
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
                        foreach (IMealingItem item in day.GetItemsOf(type))
                        {
                            AddIMealButtonToStackPanel(item, itemList);
                        }
                    }
                    else
                    {
                        AddIMealButtonToStackPanel(null, itemList);
                    }

                    Grid.SetColumn(itemList, dayIndex);
                    Grid.SetRow(itemList, RowByMealType[type]);
                    ContentGrid.Children.Add(itemList);
                    ElementsByDayindex[dayIndex].Add(itemList);
                }
            });
        }

        private void ItemClicked(IMealingItem item, FrameworkElement button)
        {
            lastClicked = button;
            lastClickedStack = button.Parent as StackPanel;
            if (item == null)
            {
                FlyoutMenu.ShowAt(button);
            }
            else if (item is Food food)
            {

            }
        }

        private void AddItemClick(object sender, RoutedEventArgs e)
        {
            ChangeToItemAdder(lastClicked);
        }

        private void ChangeToItemAdder(FrameworkElement toPlace)
        {
            StackPanel stack = toPlace.Parent as StackPanel;
            int place = stack.Children.IndexOf(toPlace);
            stack.Children.Remove(toPlace);
            AutoSuggestBox adder = GetItemAdder(stack);
            stack.Children.Insert(place, adder);
            adder.Focus(FocusState.Programmatic);

        }
        private AutoSuggestBox GetItemAdder(StackPanel forStack)
        {
            AutoSuggestBox suggBox = new AutoSuggestBox()
            {
                PlaceholderText = "Étel vagy kategória",
                HorizontalAlignment = HorizontalAlignment.Stretch,
                Margin = new Thickness(10, 0, 10, 0),
            };
            Action setItems = async () => 
            {
                List<IMealingItem> items = await Food.GetSubAndMyFoods();
                suggBox.TextChanged += (box, args) =>
                {
                    box.ItemsSource = items.FindAll((item) => { return item.ToString().ToLower().Contains(box.Text.ToLower()); });
                };
                suggBox.QuerySubmitted += async (box, args) =>
                {
                    IMealingItem choosenItem = (box.ItemsSource as List<IMealingItem>).Find((item) => { return item.ToString().Equals(args.QueryText); });
                    
                    //await AddItemTo(box.Parent, box, choosenItem);
                };
            };
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
            suggBox.LostFocus += (sender, args) => { AddItemTo(forStack, suggBox, null); };
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
            setItems.Invoke();
            return suggBox;
        }
        private async Task AddItemTo(StackPanel parent, AutoSuggestBox adder, IMealingItem choosen)
        {
            int place = parent.Children.IndexOf(adder);
            parent.Children.Remove(adder);
            if (choosen != null)
            {
                Button btn = new Button()
                {
                    Content = choosen.ToString(),
                    HorizontalAlignment = HorizontalAlignment.Stretch,
                    Margin = new Thickness(10, 0, 10, 0),
                };
                btn.Click += (sender, args) =>
                {
                    ItemClicked(choosen, btn);
                };
                parent.Children.Insert(place, btn);
            }
            else if (parent.Children.Count == 0)
            {
                AddIMealButtonToStackPanel(null, parent);
            }
        }
        private void AddIMealButtonToStackPanel(IMealingItem item, StackPanel stack)
        {
            if (item == null)
            {
                Button btn = new Button()
                {
                    Content = "-",
                    HorizontalAlignment = HorizontalAlignment.Stretch,
                    Margin = new Thickness(10, 0, 10, 0),
                };
                btn.Click += (sender, args) =>
                {
                    ItemClicked(null, btn);
                };
                stack.Children.Add(btn);
            }
            else
            {
                Button btn = new Button()
                {
                    Content = item.GetMealFood().GetName(),
                };
                btn.Click += (sender, args) =>
                {
                    ItemClicked(item, btn);
                };
                stack.Children.Add(btn);
            }
        }
    }
}
