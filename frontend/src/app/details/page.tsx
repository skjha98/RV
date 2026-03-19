import StagingTable from './StagingTable';
import LedgerTable from './LedgerTable';

export default function DetailsPage() {
    return (
        <div style={{ padding: '40px' }}>
            <h1>FINANCIAL RECONCILIATION</h1>
            <hr />
            <StagingTable />
            <LedgerTable />
        </div>
    );
}