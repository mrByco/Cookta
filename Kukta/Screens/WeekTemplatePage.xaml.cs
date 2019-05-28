using Kukta.FoodFramework;
using Kukta.FrameWork;
using Kukta.Menu;
using System;
using System.Collections.Generic;
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
    public sealed partial class WeekTemplatePage : Page
    {
        private WeekTemplate Current;
        private List<UIElement> generatedElements = new List<UIElement>();
        internal static Dictionary<EMealType, int> RowByMealType;
        private Dictionary<int, Action> ComboboxActionMap;
        public WeekTemplatePage()
        {
            this.InitializeComponent();

            TemplateManager.Instance.OnTemplatesChanged += RefreshComboboxItems;
            RefreshComboboxItems();
        }

        internal void OpenTemplate(WeekTemplate week)
        {
            
            try
            {
                Current.OnTemplateChanged -= new WeekTemplateDelegate(OpenTemplate);
            }
            catch { }
            Current = week;
            generatedElements.ForEach(element => WeekGrid.Children.Remove(element));

            if (Current != null)
            {
                Current.OnTemplateChanged += new WeekTemplateDelegate(OpenTemplate);
                DrawMeals(Enum.GetValues(typeof(EMealType)).Cast<EMealType>().ToList());
                //Draw all days
                foreach (TemplateDay day in Current.Days)
                {
                    DrawDay(day);
                }
            }
        }
        private void DrawMeals(List<EMealType> meals)
        {
            RowByMealType = new Dictionary<EMealType, int>();
            foreach (EMealType type in meals)
            {
                TextBlock TextBlock = new TextBlock();
                WeekGrid.Children.Add(TextBlock);
                TextBlock.Text = type.ToString();
                TextBlock.VerticalAlignment = VerticalAlignment.Center;
                TextBlock.HorizontalAlignment = HorizontalAlignment.Center;
                //Make grid row if not exist
                if (WeekGrid.RowDefinitions.Count <= meals.Count)
                {
                    RowDefinition row = new RowDefinition
                    {
                        Height = new GridLength(1, GridUnitType.Auto)
                    };
                    WeekGrid.RowDefinitions.Add(row);
                }
                Grid.SetRow(TextBlock, (int)type + 1);
                RowByMealType.Add(type, (int)type + 1);

            }
        }
        private void DrawDay(TemplateDay day)
        {
            int column = (int)day.DayType;
            if (column == 0) column = 7;

            foreach (EMealType mealType in RowByMealType.Keys)
            {
                Meal meal = day.GetMealOf(mealType);
                int row = RowByMealType[mealType];
                MealContent content = new MealContent(
                    meal, m =>
                    {
                        ShowAddFoodDialog(day, mealType);
                    },
                    (item) =>
                    {
                        day.RemoveItemFromMeal(mealType, item);
                    }, true);
                WeekGrid.Children.Add(content);
                generatedElements.Add(content);
                Grid.SetColumn(content, column);
                Grid.SetRow(content, row);
            }

        }

        private void ShowAddFoodDialog(TemplateDay day, EMealType mealType)
        {
            AddFoodToMealList.Children.Clear();
            foreach (IMealingItem food in FoodDatabase.Instance.Categories)
            {
                AddFoodToMealList.Children.Add(new IMealingItemButton(food, item =>
                {
                    day.AddItemToMeal(mealType, item);
                    AddFoodToMealDialog.Hide();
                }));

            }
#pragma warning disable
            AddFoodToMealDialog.ShowAsync();
#pragma warning restore
        }

        public void RefreshComboboxItems()
        {
            TemplateSelector.Items.Clear();
            ComboboxActionMap = new Dictionary<int, Action>();
            int i = 0;
            foreach (WeekTemplate template in TemplateManager.Instance.GetTemplates())
            {
                TextBlock textBlock = new TextBlock
                {
                    Text = template.TemplateName
                };
                TemplateSelector.Items.Add(textBlock);
                ComboboxActionMap.Add(i, () => OpenTemplate(template));
                if (template == Current)
                    TemplateSelector.SelectedIndex = i;
                i++;

            }
            TextBlock AddText = new TextBlock
            {
                Text = "+Új sablon+"
            };
            TemplateSelector.Items.Add(AddText);
            ComboboxActionMap.Add(i, () =>
            {
                NewWeekTemplateDialog.ShowAsync();
                NewCategoryNameTextBox.Text = "";
            });
            
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            RefreshComboboxItems();
        }

        private void NewWeekTemplateDialog_PrimaryButtonClick(ContentDialog sender, ContentDialogButtonClickEventArgs args)
        {
            WeekTemplate template = new WeekTemplate(NewCategoryNameTextBox.Text);
            OpenTemplate(template);
            TemplateManager.Instance.AddTemplate(template);
        }

        private void TemplateSelector_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            
            try
            {
                ComboboxActionMap[TemplateSelector.SelectedIndex].Invoke();
            }
            catch { }
        }

        private void OnDeleteWeekButtonClick(object sender, RoutedEventArgs e)
        {
            if (Current != null)
            {
                TemplateManager.Instance.RemoveTemplate(Current);
                OpenTemplate(null);
            }
        }
    }
}
