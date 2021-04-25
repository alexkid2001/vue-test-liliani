new Vue({
  el: '#app',
  data: {
    goodsList: [],
    brandsList: [],
    quantityList: [],
    minPrice: null,
    maxPrice: null,
    minWeight: null,
    maxWeight: null,
    filter: {
      price: null,
      weight: null,
      artNumber: null,
      name: null,
      brands: [],
      quantity: [],
      stock: [],
    },
    perpage: 10,
    currentPage: 1,
  },
  beforeCreate() {
    fetch('./goods.json').then(resp => {
      return resp.json().then(json => {
        this.goodsList = json;
        this.getBrands();
        this.getQuantity();
        this.getMinMaxPrice();
        this.getMinMaxWeight();
      })
    })
  },
  methods: {
    getBrands() {
      this.goodsList.forEach(item => {
        const { brand } = item;
        const idx = this.brandsList.indexOf(brand);
        if (idx < 0) {
          this.brandsList.push(brand);
        }
      })
    },
    getQuantity() {
      this.goodsList.forEach(item => {
        const { quantity } = item;
        const idx = this.quantityList.indexOf(quantity);
        if (idx < 0) {
          this.quantityList.push(quantity);
        }
      })
    },
    getMinMaxPrice() {
      this.maxPrice = 0;
      this.maxPrice= 0;
      this.goodsList.forEach(item => {
        if (item.price > this.maxPrice) return this.maxPrice = item.price;
        if (item.price < this.minPrice || !this.minPrice) return this.minPrice = item.price;
      })
      this.filter.price = this.maxPrice;
    },
    getMinMaxWeight() {
      this.maxWeight = 0;
      this.minWeight= 0;
      this.goodsList.forEach(item => {
        if (item.weight > this.maxWeight) return this.maxWeight = item.weight;
        if (item.weight < this.minWeight || !this.minWeight) return this.minWeight = item.weight;
      })
      this.filter.weight = this.maxWeight;
    },
    resetFilters() {
      this.filter = {
        price: this.maxPrice,
        weight: this.maxWeight,
        artNumber: null,
        name: null,
        brands: [],
        quantity: [],
        stock: [],
      }
    }
  },
  computed: {
    filteredList() {
      let list = this.goodsList;
      if (this.filter.artNumber) {
        list = list.filter(item => String(item.artnumber).includes(this.filter.artNumber));
      }
      if (this.filter.name) {
        list = list.filter(item => item.name.includes(this.filter.name));
      }
      if (this.filter.brands.length) {
        list = list.filter(item => this.filter.brands.includes(item.brand));
      }
      if (this.filter.price < this.maxPrice) {
        list = list.filter(item => item.price <= this.filter.price);
      }
      if (this.filter.weight < this.maxWeight) {
        list = list.filter(item => item.weight <= this.filter.weight);
      }
      if (this.filter.quantity.length) {
        list = list.filter(item => this.filter.quantity.includes(item.quantity));
      }
      if (this.filter.stock.length) {
        list = list.filter(item => this.filter.stock.includes(item.stock));
      }
      return list
    },
    pageCnt() {;
      if (!this.filteredList.length) return 0;
      let cnt = Math.floor(this.filteredList.length / this.perpage);
      if (this.filteredList.length % this.perpage) {
        cnt += 1;
      }
      this.currentPage = this.currentPage > cnt ? cnt : this.currentPage;
      return cnt;
    },
    paginatedList() {
      const start = (this.currentPage - 1) * this.perpage;
      const end = start + this.perpage;
      return this.filteredList.slice(start, end);
    }
  },
})
