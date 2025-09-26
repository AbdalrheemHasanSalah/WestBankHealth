import os
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import uuid

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class MedicalReferral(db.Model):
    __tablename__ = 'medical_referrals'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(20), nullable=False, index=True)
    patient_name = db.Column(db.String(100), nullable=False)
    referral_number = db.Column(db.String(50), nullable=False, unique=True, index=True)
    destination = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    approval_date = db.Column(db.DateTime, nullable=True)
    medical_condition = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'patientId': self.patient_id,
            'patientName': self.patient_name,
            'referralNumber': self.referral_number,
            'destination': self.destination,
            'status': self.status,
            'approvalDate': self.approval_date.isoformat() if self.approval_date else None,
            'medicalCondition': self.medical_condition,
            'createdAt': self.created_at.isoformat()
        }

class BorderCrossing(db.Model):
    __tablename__ = 'border_crossings'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='open')
    working_hours = db.Column(db.String(100), nullable=True)
    last_update = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'nameEn': self.name_en,
            'status': self.status,
            'workingHours': self.working_hours,
            'lastUpdate': self.last_update.isoformat(),
            'notes': self.notes
        }

class Statistics(db.Model):
    __tablename__ = 'statistics'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    total_referrals = db.Column(db.Integer, nullable=False, default=0)
    completed_travels = db.Column(db.Integer, nullable=False, default=0)
    monthly_referrals = db.Column(db.Integer, nullable=False, default=0)
    pending_referrals = db.Column(db.Integer, nullable=False, default=0)
    approval_rate = db.Column(db.Integer, nullable=False, default=0)
    average_processing_days = db.Column(db.Integer, nullable=False, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'totalReferrals': self.total_referrals,
            'completedTravels': self.completed_travels,
            'monthlyReferrals': self.monthly_referrals,
            'pendingReferrals': self.pending_referrals,
            'approvalRate': self.approval_rate,
            'averageProcessingDays': self.average_processing_days,
            'lastUpdated': self.last_updated.isoformat()
        }

# Initialize database
def init_db():
    """Initialize database and create sample data"""
    db.create_all()
    
    # Check if data already exists
    if MedicalReferral.query.count() == 0:
        # Add sample medical referrals

referrals_data = [
    {'patient_id': 'PAT001', 'patient_name': 'أحمد محمد علي', 'referral_number': 'REF2024001',
     'destination': 'مستشفى القدس - القدس', 'status': 'approved',
     'approval_date': datetime.now() - timedelta(days=5),
     'medical_condition': 'جراحة القلب', 'created_at': datetime.now() - timedelta(days=10)},
     
    {'patient_id': 'PAT002', 'patient_name': 'فاطمة أحمد حسن', 'referral_number': 'REF2024002',
     'destination': 'مستشفى الشفاء - غزة', 'status': 'pending',
     'medical_condition': 'علاج الأورام', 'created_at': datetime.now() - timedelta(days=7)},
     
    {'patient_id': 'PAT003', 'patient_name': 'محمد عبد الله قاسم', 'referral_number': 'REF2024003',
     'destination': 'مستشفى الملك حسين - عمان', 'status': 'local_followup',
     'approval_date': datetime.now() - timedelta(days=2),
     'medical_condition': 'جراحة العظام', 'created_at': datetime.now() - timedelta(days=15)},
     
    {'patient_id': 'PAT004', 'patient_name': 'سارة محمود خليل', 'referral_number': 'REF2024004',
     'destination': 'مستشفى الملك فيصل التخصصي - الرياض', 'status': 'approved',
     'approval_date': datetime.now() - timedelta(days=1),
     'medical_condition': 'زراعة الكلى', 'created_at': datetime.now() - timedelta(days=20)},
     
    {'patient_id': 'PAT005', 'patient_name': 'عمر حسام الدين', 'referral_number': 'REF2024005',
     'destination': 'مستشفى الجامعة الأردنية - عمان', 'status': 'rejected',
     'medical_condition': 'علاج طبيعي', 'created_at': datetime.now() - timedelta(days=12)}
]

        ]
        
        referrals = []
        for data in referrals_data:
            referral = MedicalReferral()
            for key, value in data.items():
                setattr(referral, key, value)
            referrals.append(referral)
        
        for referral in referrals:
            db.session.add(referral)
        
        # Add border crossings
        crossings_data = [
            {'name': 'معبر الكرامة', 'name_en': 'King Hussein Bridge', 'status': 'open',
             'working_hours': '24 ساعة', 'notes': 'مفتوح للمرضى والمرافقين'},
            {'name': 'معبر رفح', 'name_en': 'Rafah Crossing', 'status': 'closed',
             'working_hours': 'مغلق مؤقتاً', 'notes': 'مغلق بسبب الأوضاع الأمنية'},
            {'name': 'معبر بيت حانون', 'name_en': 'Erez Crossing', 'status': 'restricted',
             'working_hours': '8:00 - 16:00', 'notes': 'مفتوح للحالات الطبية الطارئة فقط'},
            {'name': 'معبر القنيطرة', 'name_en': 'Quneitra Crossing', 'status': 'open',
             'working_hours': '6:00 - 18:00', 'notes': 'مفتوح للحالات الطبية المعتمدة'}
        ]
        
        crossings = []
        for data in crossings_data:
            crossing = BorderCrossing()
            for key, value in data.items():
                setattr(crossing, key, value)
            crossings.append(crossing)
        
        for crossing in crossings:
            db.session.add(crossing)
        
        # Add statistics
        stats = Statistics()
        stats.total_referrals = 1247
        stats.completed_travels = 892
        stats.monthly_referrals = 156
        stats.pending_referrals = 234
        stats.approval_rate = 78
        stats.average_processing_days = 12
        db.session.add(stats)
        
        db.session.commit()
        print("✅ Database initialized with sample data!")

@app.route('/')
def index():
    return render_template('index.html')

# Medical Referrals API Routes
@app.route('/api/referrals/search')
def search_referrals():
    try:
        patient_id = request.args.get('patientId', '').strip()
        referral_number = request.args.get('referralNumber', '').strip()
        
        if not patient_id and not referral_number:
            return jsonify({'message': 'يرجى إدخال رقم الهوية أو رقم التحويلة'}), 400
        
        query = MedicalReferral.query
        
        if patient_id:
            query = query.filter(MedicalReferral.patient_id.ilike(f'%{patient_id}%'))
        
        if referral_number:
            query = query.filter(MedicalReferral.referral_number.ilike(f'%{referral_number}%'))
        
        referrals = query.all()
        return jsonify([referral.to_dict() for referral in referrals])
        
    except Exception as e:
        print(f"Search error: {e}")
        return jsonify({'message': 'فشل في البحث عن التحويلات الطبية'}), 500

@app.route('/api/referrals/<referral_id>')
def get_referral(referral_id):
    try:
        referral = MedicalReferral.query.get(referral_id)
        if not referral:
            return jsonify({'message': 'التحويلة الطبية غير موجودة'}), 404
        return jsonify(referral.to_dict())
    except Exception as e:
        print(f"Get referral error: {e}")
        return jsonify({'message': 'فشل في استرجاع التحويلة الطبية'}), 500

@app.route('/api/referrals', methods=['POST'])
def create_referral():
    try:
        data = request.get_json()
        
        # Validation
        required_fields = ['patientId', 'patientName', 'referralNumber', 'destination', 'medicalCondition']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'حقل {field} مطلوب'}), 400
        
        # Check if referral number already exists
        existing = MedicalReferral.query.filter_by(referral_number=data['referralNumber']).first()
        if existing:
            return jsonify({'message': 'رقم التحويلة موجود بالفعل'}), 409
        
        new_referral = MedicalReferral()
        new_referral.patient_id = data['patientId']
        new_referral.patient_name = data['patientName']
        new_referral.referral_number = data['referralNumber']
        new_referral.destination = data['destination']
        new_referral.medical_condition = data['medicalCondition']
        new_referral.status = data.get('status', 'pending')
        
        db.session.add(new_referral)
        db.session.commit()
        
        # Update statistics
        update_statistics()
        
        return jsonify(new_referral.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Create referral error: {e}")
        return jsonify({'message': 'فشل في إنشاء التحويلة الطبية'}), 500

# Border Crossings API Routes
@app.route('/api/border-crossings')
def get_border_crossings():
    try:
        crossings = BorderCrossing.query.all()
        return jsonify([crossing.to_dict() for crossing in crossings])
    except Exception as e:
        print(f"Get border crossings error: {e}")
        return jsonify({'message': 'فشل في استرجاع حالة المعابر'}), 500

@app.route('/api/border-crossings/<crossing_id>', methods=['PUT'])
def update_border_crossing(crossing_id):
    try:
        crossing = BorderCrossing.query.get(crossing_id)
        if not crossing:
            return jsonify({'message': 'المعبر غير موجود'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'status' in data:
            crossing.status = data['status']
        if 'workingHours' in data:
            crossing.working_hours = data['workingHours']
        if 'notes' in data:
            crossing.notes = data['notes']
        
        crossing.last_update = datetime.utcnow()
        db.session.commit()
        
        return jsonify(crossing.to_dict())
        
    except Exception as e:
        db.session.rollback()
        print(f"Update border crossing error: {e}")
        return jsonify({'message': 'فشل في تحديث حالة المعبر'}), 500

# Statistics API Routes
@app.route('/api/statistics')
def get_statistics():
    try:
        stats = Statistics.query.first()
        if not stats:
            # Create default statistics if none exist
            stats = Statistics()
            db.session.add(stats)
            db.session.commit()
        
        return jsonify(stats.to_dict())
    except Exception as e:
        print(f"Get statistics error: {e}")
        return jsonify({'message': 'فشل في استرجاع الإحصائيات'}), 500

def update_statistics():
    """Update statistics based on current data"""
    try:
        stats = Statistics.query.first()
        if not stats:
            stats = Statistics()
            db.session.add(stats)
        
        # Calculate statistics from actual data
        stats.total_referrals = MedicalReferral.query.count()
        stats.completed_travels = MedicalReferral.query.filter_by(status='approved').count()
        stats.pending_referrals = MedicalReferral.query.filter_by(status='pending').count()
        
        # Calculate monthly referrals (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        stats.monthly_referrals = MedicalReferral.query.filter(MedicalReferral.created_at >= thirty_days_ago).count()
        
        # Calculate approval rate
        if stats.total_referrals > 0:
            stats.approval_rate = int((stats.completed_travels / stats.total_referrals) * 100)
        
        stats.last_updated = datetime.utcnow()
        db.session.commit()
        
    except Exception as e:
        db.session.rollback()
        print(f"Update statistics error: {e}")

@app.route('/api/statistics', methods=['PUT'])
def update_statistics_manual():
    try:
        data = request.get_json()
        stats = Statistics.query.first()
        
        if not stats:
            return jsonify({'message': 'الإحصائيات غير متوفرة'}), 404
        
        # Update provided fields
        for field, value in data.items():
            if hasattr(stats, field.lower().replace('R', 'r')):  # Handle camelCase
                setattr(stats, field.lower().replace('R', 'r'), value)
        
        stats.last_updated = datetime.utcnow()
        db.session.commit()
        
        return jsonify(stats.to_dict())
        
    except Exception as e:
        db.session.rollback()
        print(f"Update statistics error: {e}")
        return jsonify({'message': 'فشل في تحديث الإحصائيات'}), 500

# Test route to check database connection
@app.route('/api/test')
def test_db():
    try:
        # Test database connection
        referrals_count = MedicalReferral.query.count()
        crossings_count = BorderCrossing.query.count()
        
        return jsonify({
            'message': 'Database connection successful! ✅',
            'referrals_count': referrals_count,
            'crossings_count': crossings_count,
            'database_url': os.environ.get('DATABASE_URL', 'Not set')[:50] + '...'
        })
    except Exception as e:
        return jsonify({
            'message': f'Database connection failed: {str(e)}',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
