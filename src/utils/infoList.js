import { getDict } from '@/utils/dictionary'
import { formatTimeToStr } from '@/utils/date'
import { ElLoading } from "element-plus";

export default {
  data() {
    return {
      page: 1,
      total: 10,
      moredata: {},
      pageSize: 10,
      tableData: [],
      searchInfo: {}
    }
  },
  methods: {
    formatBoolean: function (bool) {
      if (bool !== null) {
        return bool ? '是' : '否'
      } else {
        return ''
      }
    },
    formatDate: function (time) {
      if (time !== null && time !== '') {
        var date = new Date(time)
        return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss')
      } else {
        return ''
      }
    },
    filterDict(value, type) {
      const rowLabel = this[type + 'Options'] && this[type + 'Options'].filter(item => item.value === value)
      return rowLabel && rowLabel[0] && rowLabel[0].label
    },
    async getDict(type) {
      const dicts = await getDict(type)
      this[type + 'Options'] = dicts
      return dicts
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getTableData()
    },
    numberFormat(number, decimals, decPoint, thousandsSep, roundtag) {
      /*
          * 参数说明：
          * number：要格式化的数字
          * decimals：保留几位小数
          * dec_point：小数点符号
          * thousands_sep：千分位符号
          * roundtag:舍入参数，默认 'ceil' 向上取,'floor'向下取,'round' 四舍五入
          * console.log(numberFormat(100000.00, 2, '.', ',')) // '100,000.00'
          * */
      number = (number + '').replace(/[^0-9+-Ee.]/g, '')
      roundtag = roundtag || 'ceil' // 'ceil','floor','round'
      var n = !isFinite(+number) ? 0 : +number
      var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
      var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
      var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
      var s = ''
      var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec)
        console.log()

        return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k
      }
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
      var re = /(-?\d+)(\d{3})/
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2')
      }

      if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }
      return s.join(dec)
    },
    async getTableData(page = this.page, pageSize = this.pageSize) {
      const loadingInstance = ElLoading.service({
        fullscreen: false,
        target:document.getElementsByClassName("admin-box")[0] ,
        text:"拼命加载中..."
      });
      setTimeout(function () {
        loadingInstance.close();
      }, 5000)
      const table = await this.listApi({ page, pageSize, ...this.searchInfo })
      loadingInstance.close();
      if (table.code === 0) {
        this.tableData = table.data.list
        this.total = table.data.total
        this.page = table.data.page
        let moreData = table.data
        delete moreData["list"]
        delete moreData["page"]
        delete moreData["total"]
        this.moredata=moreData
      }
    }
  }
}
