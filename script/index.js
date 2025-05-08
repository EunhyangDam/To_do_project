Vue.createApp({
  data() {
    return {
      page: 1,
      state: {
        /**input 상태변수 */
        newTask: "",
        newExpire: "",
        editState: false,
        id: "",
        taskList: [],
        /**list pagination 상태변수 */
        totalLength: 0,
        viewLength: 3,
        pages: 0,
        listStart: 0,
        listEnd: 0,
        /**button pagination 상태변수*/
        btnShow: 5,
        btnStart: 0,
        btnEnd: 0,
        /**confirm modal */
        isConfirmModal: false,
      },
    };
  },
  created() {
    try {
      if (localStorage.getItem("taskList") !== null) {
        this.state.taskList = JSON.parse(localStorage.getItem("taskList"));
      }
      if (Number(localStorage.getItem("page")) !== null) {
        this.page = Number(localStorage.getItem("page"));
      }
    } catch (err) {
      console.log(err);
    }
    /**list pagination */
    this.state.totalLength = this.state.taskList.length;
    this.state.pages = Math.ceil(
      this.state.totalLength / this.state.viewLength
    );
    this.state.listStart = this.state.listStart * this.state.viewLength;
    this.state.listEnd = this.state.listStart + this.state.viewLength;

    /**button pagination */
    this.state.btnStart =
      (Math.ceil(this.page / this.state.btnShow) - 1) * this.state.btnShow;
    this.state.btnEnd = this.state.btnStart + this.state.btnShow;
  },
  beforeUpdate() {},
  methods: {
    updateFn() {
      this.state.taskList.map((el, idx) =>
        el.id === this.state.id
          ? ((el.task = this.state.newTask),
            (el.expire = new Date(this.state.newExpire)
              .toUTCString()
              .slice(0, -7)))
          : el
      );
      this.state.editState = false;
      this.$refs.refNewTask.focus();
      this.state.newExpire = "";
      this.state.newTask = "";
      this.state.id = "";
      localStorage.setItem("taskList", JSON.stringify(this.state.taskList));
    },
    clickButton(e) {
      if (this.state.editState === true) {
        this.updateFn();
        return;
      }
      if (this.state.newTask !== "" && this.state.newExpire === "") {
        this.$refs.refNewExpire.focus();
        return;
      }
      if (this.state.newTask === "" && this.state.newExpire !== "") {
        this.$refs.refNewTask.focus();
        return;
      }
      if (this.state.newTask === "" && this.state.newExpire === "") {
        alert("add your task!");
        return;
      } else if (new Date() > new Date(this.state.newExpire)) {
        alert("select a future!");
        return;
      }
      let today = new Date(this.state.newExpire);
      today.setHours(today.getHours() + 9);
      /**고유 ID 자동 생성
       * 저장된 모든 IDX를 뽑아낸 후 최대값 +1
       */
      let idx = 0;
      if (this.state.taskList.length === 0) {
        idx = 1;
      } else {
        idx = Math.max(...this.state.taskList.map((el) => el.id)) + 1;
      }
      this.state.taskList = [
        {
          id: idx,
          done: false,
          task: this.state.newTask,
          regi: `${new Date().getFullYear()}. ${
            new Date().getMonth() + 1
          }. ${new Date().getDate()} / ${new Date().getHours()}:${new Date().getMinutes()}`,
          expire: today.toUTCString().slice(0, -7),
          expireToggle: false,
          isedit: false,
        },
        ...this.state.taskList,
      ];

      this.$refs.refNewTask.focus();
      this.state.newExpire = "";
      this.state.newTask = "";
      localStorage.setItem("taskList", JSON.stringify(this.state.taskList));
    },
    ClickDel(id, e) {
      this.state.isConfirmModal = true;
      this.state.id = id;
    },
    clickDelYes() {
      this.state.isConfirmModal = false;
      const res = this.state.taskList.filter((el) => el.id !== this.state.id);
      this.state.taskList = res;
      localStorage.setItem("taskList", JSON.stringify(this.state.taskList));
    },
    clickDelNo() {
      this.state.isConfirmModal = false;
    },
    condition() {
      if (this.state.newTask === "" && this.state.newExpire !== "") {
        this.$refs.refNewTask.focus();
        return;
      }
    },
    changechk(id, e) {
      this.state.taskList.forEach((el) => {
        if (e.target.checked) {
          el.id === id ? (el.done = true) : el;
        } else {
          el.id === id ? (el.done = false) : el;
        }
      });
      localStorage.setItem("taskList", JSON.stringify(this.state.taskList));
    },
    /**Edit Event */
    clickEdit(el) {
      this.state.editState = true;
      let today = new Date();
      today.setHours(today.getHours() + 9);
      this.state.newExpire = today.toISOString().slice(0, -8);
      this.state.newTask = el.task;
      this.state.id = el.id;
      this.state.taskList.forEach((el2) =>
        el2.id == el.id ? (el2.isedit = true) : el2
      );
    },
    clickEditCancel() {
      this.state.editState = false;
      this.state.newExpire = "";
      this.state.newTask = "";
      this.state.id = "";
      this.state.taskList.forEach((el) => (el.isedit = false));
    },
    clickPage(n) {
      /**list pagination */
      this.page = n;
      this.state.listStart = n - 1;
      this.state.listStart = this.state.listStart * this.state.viewLength;
      this.state.listEnd = this.state.listStart + this.state.viewLength;

      /**button pagination */
      this.state.btnStart =
        (Math.ceil(this.page / this.state.btnShow) - 1) * this.state.btnShow;
      this.state.btnEnd = this.state.btnStart + this.state.btnShow;
      localStorage.setItem("page", String(this.page));
    },
    clickStart() {
      this.page = 1;
    },
    clickPrev() {
      this.page--;
      if (this.page <= 0) {
        this.page = 1;
      }
    },
    clickNext() {
      this.page++;
      if (this.page > this.state.pages) {
        this.page = this.state.pages;
      }
    },
    clickEnd() {
      this.page = this.state.pages;
    },
  },
  updated() {
    this.state.totalLength = this.state.taskList.length;
    this.state.pages = Math.ceil(
      this.state.totalLength / this.state.viewLength
    );
  },
  watch: {
    page(cur) {
      this.clickPage(cur);
    },
  },
}).mount("#root");
