
import { formatTimeToStr } from '@/utils/date'
import { ElLoading } from "element-plus"

export default {
    string2JsonCol_elUploadFileList: function (string) {
        if (!string) {
            return []
        } else {
            let newThumbArr = {}
            newThumbArr = JSON.parse(string);
            let urlArr = [];
            if (newThumbArr) {
                for (let j = 0; j < newThumbArr.length; j++) {
                    urlArr.push({
                        url: newThumbArr[j],
                        name: newThumbArr[j],
                    });
                }
            }
            return urlArr
        }
    }
    // /export default 
}
