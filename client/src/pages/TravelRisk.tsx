import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

function TravelRisk() {

    const data = [
      { id: 'TR001', location: 'Centurion, South Africa', riskLevel: 'Low', lastChecked: '2025-07-28' },
      { id: 'TR002', location: 'London, UK', riskLevel: 'Medium', lastChecked: '2025-07-25' },
      { id: 'TR003', location: 'Kyiv, Ukraine', riskLevel: 'Critical', lastChecked: '2025-07-29' },
      { id: 'TR004', location: 'Sydney, Australia', riskLevel: 'Low', lastChecked: '2025-07-20' },
      { id: 'TR005', location: 'Cairo, Egypt', riskLevel: 'High', lastChecked: '2025-07-27' },
      { id: 'TR006', location: 'Rio de Janeiro, Brazil', riskLevel: 'Medium', lastChecked: '2025-07-26' },
    ]

    const columns = [
        { field: 'id', header: 'ID' },
        { field: 'location', header: 'Location' },
        { field: 'riskLevel', header: 'RiskLevel' },
        { field: 'lastChecked', header: 'LastChecked' }
    ];

    const cellEditor = (options) => {
        return textEditor(options);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
    };

    const onCellEditComplete = (e) => {
        const { rowData, newValue, field, originalEvent: event } = e;

        rowData[field] = newValue;
        
    };
    

  return (
    <div className="flex justify-center p-4 w-screen h-screen">
      <h1 className="text-2xl font-bold">Travel Risk</h1>
      {/* Additional content can be added here */}
        <div className="card p-fluid">
            <DataTable value={data} editMode="cell" tableStyle={{ minWidth: '50rem' }}>
                {columns.map(({ field, header }) => {
                    return <Column key={field} field={field} header={header} style={{ width: '25%' }} editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>;
                })}
            </DataTable>
        </div>
    </div>
  );

}
export default TravelRisk;