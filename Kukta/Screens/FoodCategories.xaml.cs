using Kukta.FoodFramework;
using Kukta.FrameWork;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Core;
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
    public sealed partial class FoodCategories : Page
    {
        private FoodCategory m_Selected = null;
        private FoodCategory Selected
        {
            get { return m_Selected; }
            set
            {
                m_Selected = value;
                if (value != null)
                {
                    CategoryNameTextBlock.Text = Selected.CategoryName;
                }
                RefreshFoodList();
            }
        }

        public FoodCategories()
        {
            this.InitializeComponent();

            FoodDatabase.Instance.OnCategoriesChanged += new VoidDelegate(RefreshCategorieList);
        }

        public async void RefreshCategorieList()
        {
            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                string filter = SearchTextBox.Text;
                CategorieList.Children.Clear();
                List<FoodCategory> categories = FoodDatabase.Instance.Categories;
                if (filter != "")
                    categories = categories.FindAll((categ) => categ.CategoryName.ToUpper().Contains(filter.ToUpper()));
                categories.ForEach((categ) => AddCategorieToStackPanel(categ));
            });
        }
        private void AddCategorieToStackPanel(FoodCategory category)
        {
            CategorieList.Children.Add(new FoodCategorieButton(category, SelectCategorie, callBackCategory =>
            {
                FoodDatabase.Instance.DeleteCategory(callBackCategory);
            }, new Thickness(0, 3, 0, 3)));
        }

        public void RefreshFoodList()
        {
            FoodList.Children.Clear();
            if (Selected != null)
            {
                Selected.GetFoods().ForEach((food) => AddFoodItem(food));
            }
        }

        private void AddFoodItem(Food food)
        {
            FoodList.Children.Add((UIElement)new FoodButton(food.Guid, RemoveFoodFromSelected));
        }

        private void RemoveFoodFromSelected(Food food)
        {
            if (Selected != null)
            {
                Selected.RemoveFood(food);
            }
            RefreshFoodList();
        }

        private void SelectCategorie(FoodCategory category)
        {
            Selected = category;
        }

        private async void AddFoodButton_Click(object sender, RoutedEventArgs e)
        {
            if (Selected == null)
            {
                App.RootPage.ShowWarning("Nincs kategória kijelölve", "");
                return;
            }
            RefreshAddFoodDialog();
            await AddFoodDialog.ShowAsync();
        }
        private void RefreshAddFoodDialog()
        {
            //TO-DO 
            //Rename the categorie labels to food (in xaml in dialog)
            //Implement the string filer
            string filter = AddCategorieSearchBox.Text;
            AddFoodDialogList.Children.Clear();
            List<Food> foods = FoodDatabase.Instance.Foods;
            foods.ForEach((food) => AddFoodDialogList.Children.Add(new FoodButton(food.Guid, OnAddFoodDialogFoodClick)));
        }

        private void OnAddFoodDialogFoodClick(Food food)
        {
            if (Selected == null) return;
            Selected.AddFood(food);
            RefreshFoodList();
            AddFoodDialog.Hide();
        }

        private async void AddCategorieList(object sender, RoutedEventArgs e)
        {
            await AddCategorieDialog.ShowAsync();
        }

        private void RefreshAddCategoryDialogPrimaryButtonEnabled()
        {
            bool enabled = false;
            if (CategoryNameTextBox.Text != null)
            {
                enabled = true;
            }
            AddCategorieDialog.IsPrimaryButtonEnabled = enabled;
        }

        private void ApplyCategorieClick(ContentDialog sender, ContentDialogButtonClickEventArgs args)
        {
            FoodDatabase.Instance.AddCategory(CategoryNameTextBox.Text, new List<Food>());
        }

        private void CancelCategorieAddClick(ContentDialog sender, ContentDialogButtonClickEventArgs args)
        {
            AddCategorieDialog.Hide();
        }

        private void AddFoodClick(Food clicked)
        {
            Selected.AddFood(clicked);
        }

        private void CategoryNameTextChanged(object sender, TextChangedEventArgs e)
        {
            RefreshAddCategoryDialogPrimaryButtonEnabled();
        }

        private void SearchTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            RefreshCategorieList();
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            RefreshFoodList();
            RefreshCategorieList();
        }

        private void AddCategorieSearchBox_SelectionChanged(object sender, RoutedEventArgs e)
        {
            
        }
        private void AddCategorieDialogRefresh()
        {
            

        }
    }
}
