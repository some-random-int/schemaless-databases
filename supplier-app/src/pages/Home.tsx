import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OrderApi } from '../APIs/orders';

import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import Toolbar from '../components/Toolbar';

import './styles/home.css';

type DataParams = {
  supplier_key: string;
};


const Home: FC = () => {
  const { t } = useTranslation();

  const { supplier_key } = useParams<DataParams>();

  const chartTypeOptions = [
    { name: 'Bar', key: 'bar' },
    { name: 'Line', key: 'line' },
    { name: 'Pie', key: 'pie' },
    { name: 'Doughnut', key: 'doughnut' },
    { name: 'Polar Area', key: 'polarArea' },
    { name: 'Radar', key: 'radar' },
  ];
  const aggregatorOptions = [
    "country",
    "itemID",
    "orderDate",
    "shipDate",
    // "supplierID",
    "salesChannel",
    "orderPriority"
  ];
  const aggregatedOptions = [
    "unitsSold",
    "totalRevenue",
    "totalCost",
    "totalProfit",
    "orderDate",
    // "processDays"
  ];
  const operatorOptions = [
    "COUNT",
    "MIN",
    "MAX",
    "AVG",
    "SUM"
  ];
  const [ selectedTypeOption, setSelectedTypeOption ] = useState(chartTypeOptions[0]);
  const [ selectedAggregator , setSelectedAggregator ] = useState(aggregatorOptions[0]);
  const [ selectedAggregated, setSelectedAggregated ] = useState(aggregatedOptions[0]);
  const [ selectedOperator, setSelectedOperator ] = useState(operatorOptions[3]);

  const [ data, setData ] = useState({ datasets: [], labels: [] } as { labels: string[], datasets: { label: string, data: number[] }[] });
  const chartOptions = {
    scales: { 
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    aspectRatio: 2,
    // maintainAspectRatio: true
  }

  const orderApi = new OrderApi();
  const refreshGraph = (selectedAggregator: string, selectedAggregated: string, selectedOperator: string) => {
    if (!supplier_key) return;
    orderApi.analyseOrders(supplier_key, selectedAggregator, selectedAggregated, selectedOperator)
      .then((res) => res.json().then((resData: any[]) => {
        console.log(resData)
        const color = getComputedStyle(document.body).getPropertyValue('--primary-color');
        const graphData = {
          labels: resData.map((el: any): string => el[selectedAggregator]),
          datasets: [
            {
              label: selectedOperator + ' of ' + selectedAggregated + ' per ' + selectedAggregator,
              data: resData.map((el: any): number => el[selectedOperator === 'COUNT' ? 'frequency' : selectedAggregated]),
              backgroundColor: color
            }
          ]
        };
        console.log(resData, graphData);
        setData(graphData);
      }));
  }

  useEffect(() => {
    refreshGraph(selectedAggregator, selectedAggregated, selectedOperator);
  }, []);


  return (
    <div>
      <Toolbar></Toolbar>
      <div id="chart-container">
        <Chart type={selectedTypeOption.key} data={data} options={chartOptions} />
        <div id="chart-controls">
          <Dropdown value={selectedTypeOption} onChange={(e) => {setSelectedTypeOption(e.value); refreshGraph(selectedAggregator, selectedAggregated, selectedOperator);}} options={chartTypeOptions} optionLabel='name' placeholder='select a chart-type' />
          <Dropdown value={selectedOperator} onChange={(e) => {setSelectedOperator(e.value); refreshGraph(selectedAggregator, selectedAggregated, e.value);}} options={operatorOptions}  placeholder='select a chart-type' />
          <Dropdown value={selectedAggregated} onChange={(e) => {setSelectedAggregated(e.value); refreshGraph(selectedAggregator, e.value, selectedOperator);}} options={aggregatedOptions}  placeholder='select a chart-type' />
          <Dropdown value={selectedAggregator} onChange={(e) => {setSelectedAggregator(e.value); refreshGraph(e.value, selectedAggregated, selectedOperator);}} options={aggregatorOptions}  placeholder='select a chart-type' />
        </div>
      </div>
    </div>
  );
};

export default Home;
