from datetime import datetime, timedelta
from typing import List
from sqlite3 import Connection
from ..models.alert import Alert
from ..models.case import DiseaseCase

class AlertService:
    def get_active_alerts(self, db: Connection) -> List[Alert]:
        cursor = db.cursor()
        seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
        
        cursor.execute(
            """
            SELECT disease, SUM(cases) as total_cases
            FROM cases 
            WHERE timestamp >= ?
            GROUP BY disease
            HAVING total_cases > 1000
            """,
            (seven_days_ago,)
        )
        
        alerts = []
        for row in cursor.fetchall():
            disease, total_cases = row
            alerts.append(Alert(
                id=f"{disease}-{datetime.now().timestamp()}",
                message=f"Severe {disease} outbreak with {total_cases} cases",
                severity="high",
                timestamp=datetime.now().isoformat()
            ))
        
        return alerts