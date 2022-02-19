//import css, state, effect
import styles from "./Homepage.module.css";
import { useState, useEffect } from "react";

//import antdesign
import {
  Layout,
  Space,
  Button,
  Form,
  Radio,
  InputNumber,
  Cascader,
} from "antd"; //dropdown multi option
import "antd/dist/antd.css";
import axios from "axios";

export function Homepage() {
  const { Header, Footer, Sider, Content } = Layout;
  // all variable
  //fetch from backend
  const [insulinData, setInsulinData] = useState([]);
  // age, weight, typeInsulin, sugarBlood, sugarTarget, quantity, unit,type, menu, carbohydrate
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");

  //ประเภท insulin ที่เลือก
  const [typeInsulin, setTypeInsulin] = useState("");
  //ระดับนำ่ตาลในเลือด และระดับน้ำตาลเป้าหมาย
  const [sugarBlood, setSugarBlood] = useState("");
  const [sugarTarget, setSugarTarget] = useState("");

  //จำนวนต่อ 1 คาร์บ
  const [quantity, setQuantity] = useState(0);
  //หน่วยของเมนูนั้่นๆ
  const [unit, setUnit] = useState("หน่วย");
  //
  const [menu, setMenu] = useState("");
  const [carbohydrate, setCarbohydrate] = useState(0);
  const [inputAmount, setInputAmount] = useState(0);
  const [bsi, setBsi] = useState(0);
  const [bli, setBli] = useState(0);
  const [menuList, setMenuList] = useState([]);
  //type menu
  const [resultRice, setResultRice] = useState([]);
  const [resultFruit, setResultFruit] = useState([]);
  const [resultMilk, setResultMilk] = useState([]);
  const [resultFast, setResultFast] = useState([]);
  const [resultBakery, setResultBakery] = useState([]);
  const [resultDessert, setResultDessert] = useState([]);

  //array data object
  const typeList = [
    { label: "ข้าวแป้งและผลิตภัณฑ์", value: "rice", children: resultRice },
    { label: "ผลไม้", value: "fruit", children: resultFruit },
    { label: "นมและผลิตภัณฑ์", value: "milk", children: resultMilk },
    { label: "อาหารฟาสต์ฟู้ด", value: "fast", children: resultFast },
    { label: "เบเกอรี", value: "bakery", children: resultBakery },
    { label: "ขนมหวาน", value: "dessert", children: resultDessert },
  ];

  //get,set select_menu_type, select_menu from dropdown
  function onChangeDropdown(value) {
    if (value) {
      setMenu(value[1]);
      setMenuList(
        typeList
          .filter((x) => x.value === value[0])[0]
          .children.filter((eachChildren) => eachChildren.menu === value[1])
      );
    } else {
      setMenu("");
      setMenuList([]);
    }
  }
  //get,set Age
  function onChangeAge(value) {
    setAge(value);
  }
  //get,set Weight
  function onChangeWeight(value) {
    setWeight(value);
  }
  //get,set typeInsulin
  const onChangeTypeInsulin = (e) => {
    setTypeInsulin(e.target.value);
  };
  //get,set SugarBlood
  function onChangeSugarBlood(value) {
    setSugarBlood(value);
  }
  //get,set SugarTarget
  function onChangeSugarTarget(value) {
    setSugarTarget(value);
  }
  //get,set inputQuantity
  function onChangeInputAmount(value) {
    setInputAmount(value);
  }

  function calculate() {
    let a = age;
    let w = weight;
    let tdd;
    let noc;
    let iff;
    let ieh;
    let carb = carbohydrate;
    if (a <= 5) {
      tdd = w * 0.6;
    } else {
      tdd = w;
    }
    //set BSI
    setBsi(tdd * 0.5);
    //set NOC
    noc = carbohydrate * (inputAmount / quantity);
    //set IFF
    iff = noc / (500 / tdd);
    //calculate IEH
    if (typeInsulin === "RI") {
      ieh = (sugarBlood - sugarTarget) / (1500 / tdd);
    } else if (typeInsulin === "RAA") {
      ieh = (sugarBlood - sugarTarget) / (1800 / tdd);
    } else {
      ieh = 0;
    }
    //set BLI
    setBli(ieh + iff);
  }

  //   menuList = insulinData.filter( info => info.type === selectType)
  const fetchInsulin = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_BACKEND + "/insulins"
      );
      // console.log(data);
      setInsulinData(data);
      setResultRice(data.filter((info) => info.type === "rice"));
      setResultFruit(data.filter((info) => info.type === "fruit"));
      setResultMilk(data.filter((info) => info.type === "milk"));
      setResultFast(data.filter((info) => info.type === "fast"));
      setResultBakery(data.filter((info) => info.type === "bakery"));
      setResultDessert(data.filter((info) => info.type === "dessert"));
    } catch (error) {
      alert("Error");
    }
  };

  useEffect(() => {
    fetchInsulin();
  }, []);

  useEffect(() => {}, [carbohydrate]);

  useEffect(() => {}, [typeInsulin]);

  useEffect(() => {
    onChangeDropdown();
    menuList.map((eachMenu, index) => setCarbohydrate(eachMenu.carbohydrate));
    menuList.map((eachMenu, index) => setQuantity(eachMenu.quantity));
    menuList.map((eachMenu, index) => setUnit(eachMenu.unit));
  }, [menu]);

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>Program Calculate Insulin</p>
      </div>
      <div className={styles.input}>
        <Form name="complex-form" className={styles.Form}>
          <Form.Item label="อายุ" className={styles.Form1}>
            <InputNumber
              addonAfter="ปี"
              min={1}
              max={90}
              onChange={onChangeAge}
            ></InputNumber>
          </Form.Item>

          <Form.Item label="น้ำหนัก">
            <InputNumber
              addonAfter="กิโลกรัม"
              min={1}
              max={200}
              onChange={onChangeWeight}
            ></InputNumber>
          </Form.Item>

          <Form.Item label="ชนิดของ Insulin ที่ใช้" name="typeInsulin">
            <Radio.Group onChange={onChangeTypeInsulin} value={typeInsulin}>
              <Radio value={"RI"}>
                Regular insulin (RI) [Humulin R&reg;, Actrapid HM&reg;]
              </Radio>
              <Radio value={"RAA"}>
                Rapid-acting analogues (RAA) [Humalog&reg;, NovoRapid&reg;,
                Apidra Solostar&reg;]
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="ระดับน้ำตาลในเลือด">
            <InputNumber
              addonAfter="mg/dL"
              min={0}
              max={400}
              onChange={onChangeSugarBlood}
            ></InputNumber>
          </Form.Item>

          <Form.Item label="ระดับน้ำตาลเป้าหมาย">
            <InputNumber
              addonAfter="mg/dL"
              min={0}
              max={200}
              onChange={onChangeSugarTarget}
            ></InputNumber>
          </Form.Item>

          <Form.Item label="อาหารที่รับประทาน">
            <Cascader
              options={typeList}
              onChange={onChangeDropdown}
              placeholder="กรุณาเลือกประเภทเมนู และเมนู"
              size="middle"
            />
          </Form.Item>

          <Form.Item label="จำนวนที่รับประทาน">
            <InputNumber
              addonAfter={unit}
              min={0}
              max={100}
              onChange={onChangeInputAmount}
            ></InputNumber>
          </Form.Item>
        </Form>
      </div>

      <Space>
        <Button type="primary" shape="round" size="large" onClick={calculate}>
          Primary Button
        </Button>
        <Button
          type="primary"
          shape="round"
          size="large"
          danger
          onClick={refreshPage}
        >
          Reset Button
        </Button>
      </Space>

      <div className="output">
        <Space>
          <p>ปริมาณอินซูลินพื้นฐานที่ต้องได้รับ: {bsi}</p>
          <p>ปริมาณอินซูลินสำหรับมื้ออาหาร: {bli}</p>
        </Space>
      </div>
    </div>
  );
}
