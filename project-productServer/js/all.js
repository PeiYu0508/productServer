$(document).ready(function () {
  
  let page = new Vue({
    el: '#wrap',
    data: {
        currentView: 'home'
    },
    components: {
        'home': {
            template: '#home-template',
        },
        'orders': {
            template: '#orders-template',
            activated() {
                this.count++;
            },
            data() {
                return {
                    count: 0
                }
            }
        },
        'product': {
            template: '#product-template',
            data() {
              return {
                imgUrl: "",
                file: ""
              }
            },
            methods: {
              addNewProductClick() {
                $(".cover").show();
                $(".addNewProduct").show();
              },
              close() {
                $(".cover").hide();
                $(".addNewProduct").hide();
                clearContent();
              },
              deleteProduct() {
                $(".del").click(function(e) {
                  $(this).parent().parent().parent().remove();
                });
              },
              addSpecification() {
                $(".enterSpecificationBlockN").append('<div class="enterSpecificationBlock">'
                                                      + '<div class="enterSize">'
                                                        + '<p>Size</p>'
                                                        + '<select name="" id="sizeVal">'
                                                          + '<option value="L">L</option>'
                                                          + '<option value="M">M</option>'
                                                          + '<option value="S">S</option>'
                                                        + '</select>'
                                                      + '</div>'
                                                      + '<div class="enterColor">'
                                                        + '<p>Color</p>'
                                                        + '<input type="text" id="myColor">'
                                                      + '</div>'
                                                      + '<div class="enterInventory">'
                                                        + '<p>Inventory</p>'
                                                        + '<input type="number" id="myInventory">'
                                                      + '</div>'
                                                    + '</div>');
              },
              previewImg(e) {
                let file = e.target.files[0];
                this.file = file;
                this.imgUrl = URL.createObjectURL(file);
              },
              addProduct() {
                  let file = this.file;
                  this.imgUrl = URL.createObjectURL(file);
                  let disc = $("#disTitle").val();
                  let price = $("#myPrice").val();
                  let discount = $("#myDiscount").val();
                  
                  let sizeInfos = [];
                  $(".enterSpecificationBlock").each(function() {
                    let size = $(this).find("#sizeVal").val();
                    let color = $(this).find("#myColor").val();
                    let inventory = $(this).find("#myInventory").val();
                    let colorInventories = [];
                    let colorInventory = new ColorInventory(color, inventory);
                    let obj = sizeInfos.find(o => o.size == size);
                    if (obj == undefined) {
                      colorInventories.push(colorInventory);
                      let sizeInfo = new SizeInfo(size, colorInventories);
                      sizeInfos.push(sizeInfo);
                    } else {
                      colorInventories = obj.colorInventories;
                      colorInventories.push(colorInventory);
                    }
                  });
                  $(".cover").hide();
                  $(".addNewProduct").hide();
                  $(".productN").append('<tr class="product">'
                                          + '<td>'
                                              + '<div class="productDiv">'
                                                  + '<p>' + disc + '</p>'
                                                  + '<img src="' + this.imgUrl + '">'
                                                  
                                              + '</div>'
                                          + '</td>'
                                          + '<td>'
                                            + '<div calss="originalDiv">'
                                              + '<p>' + price + '</p>'
                                            + '</div>'
                                          + '</td>'
                                          + '<td class="discountCol">'
                                            + '<p>' + discount + '</p>'
                                          + '</td>'
              
                                          + '<td colspan="3">'
                                            + '<div class="sizes">'
                                              +  appendSizesStr(sizeInfos)
                                            + '</div>'
                                          + '</td>'
              
                                          + '<td>'
                                            + '<select name="" id="status">'
                                              + '<option value="PUBLISHED">PUBLISHED</option>'
                                              + '<option value="UNPUBLISHED">UNPUBLISHED</option>'
                                            + '</select>'
                                            + '<button class="del" v-on:click="deleteProduct()">DELETE</button>'
                                          + '</td>'
                                        + '</tr>');   
                  
                  clearContent();
                  $(".del").click(function(e) {
                    $(this).parent().parent().parent().remove();
                  });
              }

            }
        }
    }
  });

  let ctx = $("#myChart");
  let myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
      datasets: [
        {
          label: 'Total revenue',
          data: [0,0,0,0,0,0,0,0,0,0,0,0],
          backgroundColor: 'rgba(126, 211, 33, 0.2)',
          borderColor: '#7ED321',
          borderWidth: 2
        },
        {
          label: 'Total cost',
          data: [0,0,0,0,0,0,0,0,0,0,0,0],
          backgroundColor: 'rgba(208, 2, 27, 0.2)',
          borderColor: '#D0021B',
          borderWidth: 2
        },
        {
          label: 'Net Income',
          data: [0,0,0,0,0,0,0,0,0,0,0,0],
          backgroundColor: 'rgba(74, 144, 266, 0.2)',
          borderColor: '#4A90E2',
          borderWidth: 2
        }
      ]
    },
    options: {
      scales: {
          y: {
              beginAtZero: true
          }
      }
    }
  });

  function updateRevenue(data) {
    let sum = 0;
    data.forEach(function(element, index) {
      let revenueId = "#r" + (index+1);
      let value = $(revenueId).val();
      this[index] = value != 0? value: 0;
      sum += parseInt(this[index], 10);
    }, data);
    return sum;
  }

  function updateCost(data) {
    let sum = 0;
    data.forEach(function(element, index) {
      let costId = "#c" + (index+1);
      let value = $(costId).val();
      this[index] = value != 0? value: 0;
      sum += parseInt(this[index], 10);
    }, data);
    return sum;
  }

  function updateNetIncome(data) {
    let sum = 0;
    data.forEach(function(element, index) {
      let netIncomeId = "#n" + (index+1);
      let value = $(netIncomeId).val();
      this[index] = value != 0? value: 0;
      sum += parseInt(this[index], 10);
    }, data);
    return sum;
  }

  let datasets = myChart.data.datasets
  let revenueDataArr = datasets[0].data;
  let costDataArr = datasets[1].data;
  let netIncomeDataArr = datasets[2].data;

  let totalRevenue = 0;
  let totalCost = 0;
  let netIncome = 0;

  $("#update").click(function(e) {
    totalRevenue = updateRevenue(revenueDataArr);
    totalCost = updateCost(costDataArr);
    netIncome = updateNetIncome(netIncomeDataArr);
    $("#revenueData").text(totalRevenue);
    $("#costData").text(totalCost);
    $("#incomeData").text(netIncome);
    myChart.update();
  });

  $("#random").click(function(e){
    totalRevenue = randomRevenue(revenueDataArr);
    totalCost = randomCost(costDataArr);
    netIncome = randomNetIncome(netIncomeDataArr);
    $("#revenueData").text(totalRevenue);
    $("#costData").text(totalCost);
    $("#incomeData").text(netIncome);
    myChart.update();
  }); 
  
  function randomRevenue(data) {
    let sum = 0;
    data.forEach(function(element, index) {
      let revenueId = "#r" + (index+1);
      this[index] = Math.floor(Math.random() * 10000);
      $(revenueId).attr("value", (parseInt(this[index], 10)));
      sum += parseInt(this[index], 10);
    }, data);
    return sum;
  }

  function randomCost(data) {
    let sum = 0;
    data.forEach(function(element, index) {
      let costId = "#c" + (index+1);
      this[index] = Math.floor(Math.random() * 10000);
      $(costId).attr("value", (parseInt(this[index], 10)));
      sum += parseInt(this[index], 10);
    }, data);
    return sum;
  }

  function randomNetIncome(data) {
    let sum = 0;
    data.forEach(function(element, index) {
      let netIncomeId = "#n" + (index+1);
      this[index] = Math.floor(Math.random() * 10000);
      $(netIncomeId).attr("value", (parseInt(this[index], 10)));
      sum += parseInt(this[index], 10);
    }, data);
    return sum;
  }

  function clearContent() {
    $(".addContent input").val("");
    $(".addContent textarea").val("");
    $("#image_upload_preview").attr("src", "");
    $(".enterSpecificationBlockN").find("div").remove();
  }

  class SizeInfo {
    constructor(size, colorInventories) {
      this.size = size;
      this.colorInventories = colorInventories;
    }
  }

  class ColorInventory {
    constructor(color, inventory) {
      this.color = color;
      this.inventory = inventory;
    }
  }

  function appendSizesStr(sizeInfos) {
    let str = "";
    sizeInfos.forEach(function(sizeInfo, index) {
      str += '<div class="size">'
                + '<p class="sizeVal">' + sizeInfo.size + '</p>'
                + '<div class="color">';
      sizeInfo.colorInventories.forEach(function(colorInventory) {
        str += '<p>' + colorInventory.color + '</p>';
      });
      
      str += '</div>'
            + '<div class="inv">';
      sizeInfo.colorInventories.forEach(function(colorInventory) {
        str += '<p>' + colorInventory.inventory + '</p>';
      });
      str += '</div> </div>';
    });
    return str;
  }

});
