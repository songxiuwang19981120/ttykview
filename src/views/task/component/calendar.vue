<template>
    <div id="customizedCalendar">
      <el-calendar
          :first-day-of-week=7
          v-model="value">
        <template
            slot="dateCell"
            slot-scope="{data}">
          <div slot="reference" class="div-Calendar" @click="clickCalendar(data)" style="position: relative;z-index: 10">
            <p>{{ data.day.split('-').slice(2).join('-') }}</p>
            {{ data.isSelected ? "✔️" : "" }}
            <div
          style="width: 100% "
          v-for="(item, index) in scheduleData"
          :key="index"
        >
          <!-- 方法一：
            为了避免渲染本应该被隐藏的列表 (比如 v-for="(content, index) in item.content" v-if="item.workingDay.indexOf(data.day) != -1")。
            这种情形下，请将 v-if 移动至容器元素上 (比如 div)。 
        -->
          <div v-if="item.workingDay.indexOf(data.day) != -1">
            <ul
              v-for="(content, index) in tag
                ? item.content.slice(0, 3)
                : item.content"
              :key="index"
            >
              <li
                :class="
                  content.type === 'important' ? 'importantSty' : 'secondarySty'
                "
              >
                {{ content.notice }}
              </li>
            </ul>
            <span v-if="item.content.length > 3" @click.stop="isShow()">{{
              tag ? "查看更多" : "收起"
            }}</span>
          </div>
</div>
          </div>
          <div v-if="data.isSelected" id="selectP"></div>
        </template>
      </el-calendar>
      <div id="button">
        <el-button @click="skip('preYear')" type="primary" round size="mini"><i class="el-icon-arrow-left"></i>年
        </el-button>
        <el-button @click="skip('preMonth')" type="warning" round size="mini"><i class="el-icon-arrow-left"></i>月
        </el-button>
        <el-button @click="skip('preDay')" type="success" round size="mini"><i class="el-icon-arrow-left"></i>日
        </el-button>
        <el-button @click="skip('today')" type="info" round size="mini">今天</el-button>
        <el-button @click="skip('postDay')" type="success" round size="mini">日<i class="el-icon-arrow-right"></i>
        </el-button>
        <el-button @click="skip('postMonth')" type="warning" round size="mini">月<i class="el-icon-arrow-right"></i>
        </el-button>
        <el-button @click="skip('postYear')" type="primary" round size="mini">年<i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </div>
  </template>
  
  <script>
  import moment from 'moment'
  import PubSub from 'pubsub-js'
  
  export default {
    name: "Calendar",
    data() {
      return {
        value: new Date(),
        tag: true, // 控制展开收起
      scheduleData: [
        {
          workingDay: "2022-04-02",
          content: [
            {
              notice: "这是紧急事项",
              type: "important",
            },
          ],
        },
        {
          workingDay: "2022-04-25",
          content: [
            {
              notice: "这件事很重要很重要",
              type: "important",
            },
            {
              notice: "记得点个赞",
              type: "secondary",
            },
          ],
        },
        {
          workingDay: "2022-05-02",
          content: [
            {
              notice: "记得点个赞",
              type: "important",
            },
          ],
        },
        {
          workingDay: "2022-05-08",
          content: [
            {
              notice: "记得点个赞",
              type: "important",
            },
          ],
        },
      ],
      }
    },
    computed: {
      selectDate() {
        return moment(this.value).format("YYYY-MM-DD");
      }
    },
    methods: {
      skip(flag) {
        if (flag === 'preYear') this.value = new Date(this.value.setFullYear(this.value.getFullYear() - 1));
        else if (flag === 'preMonth') this.value = new Date(this.value.setMonth(this.value.getMonth() - 1));
        else if (flag === 'preDay') this.value = new Date(this.value.setDate(this.value.getDate() - 1));
        else if (flag === 'today') this.value = new Date();
        else if (flag === 'postDay') this.value = new Date(this.value.setDate(this.value.getDate() + 1));
        else if (flag === 'postMonth') this.value = new Date(this.value.setMonth(this.value.getMonth() + 1));
        else if (flag === 'postYear') this.value = new Date(this.value.setFullYear(this.value.getFullYear() + 1));
      },
      isShow(){
        this.tag=!this.tag
      },
      clickCalendar(data) {
        console.log(data)
        PubSub.publish("uploadWarningResultWarningTime", data.day);
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  #customizedCalendar {
    width: 100%;
    height: 100%;
  
    #button {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    #selectP {
      width: 30px;
      background-color: #15ff2c;
      position: absolute;
      border-radius: 50%;
      opacity: 0.6;
    }
  
    ::v-deep .el-calendar__header {
      // 修改头部背景颜色
      background-color: #57617C;
      padding: 3px 5px;
      border: none;
      display: flex;
      justify-content: center;
  
      .el-calendar__button-group {
        // 隐藏原生按钮
        display: none;
      }
  
      .el-calendar__title {
        // 修改头部标题的字体颜色
        color: white !important;
        font-size: 18px;
        font-weight: bolder;
      }
    }
  
    ::v-deep .el-calendar__body {
      // 修改主题部分
      padding: 0;
    }
  
    ::v-deep .el-calendar-table {
      thead {
        th {
          // 修改头部星期部分
          padding: 0;
          background-color: #57617C;
          color: white;
        }
      }
  
      .is-selected {
        .el-calendar-day {
          p {
            // 选中日期颜色
            color: black;
          }
        }
      }
  
      .el-calendar-day {
        // 每天小块样式设置
        padding: 0;
 
        display: flex;
        justify-content: center;
        align-items: center;
  
        p {
          // 所有日期颜色
          color: black;
          z-index: 1;
          user-select: none;
          display: flex;
        }
      }
    }
  
    ::v-deep .el-calendar-table__row {
      .prev, .next {
        // 修改非本月
        .el-calendar-day {
          p {
            color: #f0d9d5;
          }
        }
      }
  
      td {
        // 修改每一个日期td标签
        &:first-child, &:last-child {
          background-color: #f5f5f5;
        }
      }
    }
  
    button {
      padding: 3px 10px;
    }
  }
  .dashboard-container {
  .is-selected {
    color: #1989fa;
  }
 
  p {
    margin: 10px auto;
  }
 
  ul {
    list-style: none;
    padding: 0;
  }
 
  .importantSty {
    color: red;
    // background-color: rgba(235, 22, 22, 0.5);
  }
 
  .secondarySty {
    color: tan;
    // background-color: rgba(235, 150, 22, 0.5);
  }
 
  ::v-deep .el-calendar-table {
    .el-calendar-day {
      height: auto;
    }
  }
}
  </style>
  