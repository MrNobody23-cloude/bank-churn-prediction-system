import random

CUSTOMER_DATA = [
    {"Year":2025,"CustomerId":15634602,"Surname":"Hargrave","CreditScore":619,"Geography":"France","Gender":"Female","Age":42,"Tenure":2,"Balance":0,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":101348.88,"Exited":0},
    {"Year":2025,"CustomerId":15647311,"Surname":"Hill","CreditScore":608,"Geography":"Spain","Gender":"Female","Age":41,"Tenure":1,"Balance":83807.86,"NumOfProducts":1,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":112542.58,"Exited":0},
    {"Year":2025,"CustomerId":15619304,"Surname":"Onio","CreditScore":502,"Geography":"France","Gender":"Female","Age":42,"Tenure":8,"Balance":159660.8,"NumOfProducts":3,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":113931.57,"Exited":1},
    {"Year":2025,"CustomerId":15701354,"Surname":"Boni","CreditScore":699,"Geography":"France","Gender":"Female","Age":39,"Tenure":1,"Balance":0,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":0,"EstimatedSalary":93826.63,"Exited":0},
    {"Year":2025,"CustomerId":15737888,"Surname":"Mitchell","CreditScore":850,"Geography":"Spain","Gender":"Female","Age":43,"Tenure":2,"Balance":125510.82,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":79084.1,"Exited":0},
    {"Year":2025,"CustomerId":15574012,"Surname":"Chu","CreditScore":645,"Geography":"Spain","Gender":"Male","Age":44,"Tenure":8,"Balance":113755.78,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":149756.71,"Exited":1},
    {"Year":2025,"CustomerId":15592531,"Surname":"Bartlett","CreditScore":822,"Geography":"France","Gender":"Male","Age":50,"Tenure":7,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":10062.8,"Exited":0},
    {"Year":2025,"CustomerId":15656148,"Surname":"Obinna","CreditScore":376,"Geography":"Germany","Gender":"Female","Age":29,"Tenure":4,"Balance":115046.74,"NumOfProducts":4,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":119346.88,"Exited":1},
    {"Year":2025,"CustomerId":15792365,"Surname":"He","CreditScore":501,"Geography":"France","Gender":"Male","Age":44,"Tenure":4,"Balance":142051.07,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":74940.5,"Exited":0},
    {"Year":2025,"CustomerId":15767821,"Surname":"Bearce","CreditScore":528,"Geography":"France","Gender":"Male","Age":31,"Tenure":6,"Balance":102016.72,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":0,"EstimatedSalary":80181.12,"Exited":0},
    {"Year":2025,"CustomerId":15737173,"Surname":"Andrews","CreditScore":497,"Geography":"Spain","Gender":"Male","Age":24,"Tenure":3,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":76390.01,"Exited":0},
    {"Year":2025,"CustomerId":15632264,"Surname":"Kay","CreditScore":476,"Geography":"France","Gender":"Female","Age":34,"Tenure":10,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":26260.98,"Exited":0},
    {"Year":2025,"CustomerId":15691483,"Surname":"Chin","CreditScore":549,"Geography":"France","Gender":"Female","Age":25,"Tenure":5,"Balance":0,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":0,"EstimatedSalary":190857.79,"Exited":0},
    {"Year":2025,"CustomerId":15600882,"Surname":"Scott","CreditScore":635,"Geography":"Spain","Gender":"Female","Age":35,"Tenure":7,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":65951.65,"Exited":0},
    {"Year":2025,"CustomerId":15643966,"Surname":"Goforth","CreditScore":616,"Geography":"Germany","Gender":"Male","Age":45,"Tenure":3,"Balance":143129.41,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":64327.26,"Exited":1},
    {"Year":2025,"CustomerId":15737452,"Surname":"Romeo","CreditScore":653,"Geography":"Germany","Gender":"Male","Age":58,"Tenure":1,"Balance":132602.88,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":5097.67,"Exited":1},
    {"Year":2025,"CustomerId":15788218,"Surname":"Henderson","CreditScore":549,"Geography":"Spain","Gender":"Female","Age":24,"Tenure":9,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":14406.41,"Exited":0},
    {"Year":2025,"CustomerId":15661507,"Surname":"Muldrow","CreditScore":587,"Geography":"Spain","Gender":"Male","Age":45,"Tenure":6,"Balance":0,"NumOfProducts":1,"HasCrCard":0,"IsActiveMember":0,"EstimatedSalary":158684.81,"Exited":0},
    {"Year":2025,"CustomerId":15568982,"Surname":"Hao","CreditScore":726,"Geography":"France","Gender":"Female","Age":24,"Tenure":6,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":160501.03,"Exited":0},
    {"Year":2025,"CustomerId":15577657,"Surname":"McDonald","CreditScore":732,"Geography":"France","Gender":"Male","Age":41,"Tenure":8,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":139566.78,"Exited":0},
    {"Year":2025,"CustomerId":15597945,"Surname":"Dellucci","CreditScore":636,"Geography":"Spain","Gender":"Female","Age":32,"Tenure":8,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":181773.14,"Exited":0},
    {"Year":2025,"CustomerId":15699309,"Surname":"Gerasimov","CreditScore":510,"Geography":"Spain","Gender":"Female","Age":38,"Tenure":4,"Balance":0,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":81004.95,"Exited":0},
    {"Year":2025,"CustomerId":15725737,"Surname":"Mosman","CreditScore":669,"Geography":"France","Gender":"Male","Age":46,"Tenure":3,"Balance":0,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":69366.27,"Exited":0},
    {"Year":2025,"CustomerId":15625047,"Surname":"Yen","CreditScore":846,"Geography":"France","Gender":"Female","Age":38,"Tenure":5,"Balance":0,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":145936.59,"Exited":0},
    {"Year":2025,"CustomerId":15738191,"Surname":"Maclean","CreditScore":577,"Geography":"France","Gender":"Male","Age":25,"Tenure":3,"Balance":0,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":103889.6,"Exited":0},
    {"Year":2025,"CustomerId":15736816,"Surname":"Young","CreditScore":756,"Geography":"Germany","Gender":"Male","Age":36,"Tenure":2,"Balance":136815.64,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":180577.6,"Exited":0},
    {"Year":2025,"CustomerId":15700772,"Surname":"Nebechi","CreditScore":571,"Geography":"France","Gender":"Male","Age":44,"Tenure":9,"Balance":0,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":0,"EstimatedSalary":163668.48,"Exited":0},
    {"Year":2025,"CustomerId":15728693,"Surname":"McWilliams","CreditScore":574,"Geography":"Germany","Gender":"Female","Age":43,"Tenure":3,"Balance":141349.43,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":143894.78,"Exited":1},
    {"Year":2025,"CustomerId":15656300,"Surname":"Lucciano","CreditScore":411,"Geography":"France","Gender":"Male","Age":29,"Tenure":0,"Balance":59697.17,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":100149.78,"Exited":0},
    {"Year":2025,"CustomerId":15589475,"Surname":"Azikiwe","CreditScore":591,"Geography":"Spain","Gender":"Female","Age":39,"Tenure":3,"Balance":0,"NumOfProducts":3,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":71704.12,"Exited":1},
    {"Year":2025,"CustomerId":15706552,"Surname":"Odinakachukwu","CreditScore":533,"Geography":"France","Gender":"Male","Age":36,"Tenure":7,"Balance":85311.7,"NumOfProducts":1,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":161253.2,"Exited":0},
    {"Year":2025,"CustomerId":15750181,"Surname":"Sanderson","CreditScore":553,"Geography":"Germany","Gender":"Male","Age":41,"Tenure":9,"Balance":110112.54,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":0,"EstimatedSalary":75931.82,"Exited":0},
    {"Year":2025,"CustomerId":15659428,"Surname":"Maggard","CreditScore":520,"Geography":"Spain","Gender":"Female","Age":42,"Tenure":6,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":91129.54,"Exited":0},
    {"Year":2025,"CustomerId":15732963,"Surname":"Clements","CreditScore":722,"Geography":"Spain","Gender":"Female","Age":29,"Tenure":9,"Balance":0,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":162261.94,"Exited":0},
    {"Year":2025,"CustomerId":15794171,"Surname":"Lombardo","CreditScore":475,"Geography":"France","Gender":"Female","Age":45,"Tenure":0,"Balance":134264.04,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":173325.72,"Exited":0},
    {"Year":2025,"CustomerId":15788448,"Surname":"Watson","CreditScore":490,"Geography":"Spain","Gender":"Male","Age":31,"Tenure":3,"Balance":145260.23,"NumOfProducts":1,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":100798.81,"Exited":0},
    {"Year":2025,"CustomerId":15729599,"Surname":"Lorenzo","CreditScore":804,"Geography":"Spain","Gender":"Male","Age":33,"Tenure":7,"Balance":76548.6,"NumOfProducts":1,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":70949.17,"Exited":0},
    {"Year":2025,"CustomerId":15717426,"Surname":"Armstrong","CreditScore":850,"Geography":"France","Gender":"Male","Age":36,"Tenure":7,"Balance":0,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":56295.16,"Exited":0},
    {"Year":2025,"CustomerId":15585768,"Surname":"Cameron","CreditScore":582,"Geography":"Germany","Gender":"Male","Age":41,"Tenure":6,"Balance":70349.48,"NumOfProducts":2,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":151695.93,"Exited":0},
    {"Year":2025,"CustomerId":15619360,"Surname":"Hsiao","CreditScore":472,"Geography":"Spain","Gender":"Male","Age":40,"Tenure":4,"Balance":0,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":112513.02,"Exited":0},
    {"Year":2025,"CustomerId":15738148,"Surname":"Clarke","CreditScore":465,"Geography":"France","Gender":"Female","Age":51,"Tenure":8,"Balance":122522.32,"NumOfProducts":1,"HasCrCard":0,"IsActiveMember":0,"EstimatedSalary":163458.12,"Exited":1},
    {"Year":2025,"CustomerId":15687946,"Surname":"Osborne","CreditScore":556,"Geography":"France","Gender":"Female","Age":61,"Tenure":2,"Balance":117419.35,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":164412.08,"Exited":1},
    {"Year":2025,"CustomerId":15755196,"Surname":"Lavine","CreditScore":834,"Geography":"France","Gender":"Female","Age":49,"Tenure":2,"Balance":131394.56,"NumOfProducts":1,"HasCrCard":0,"IsActiveMember":0,"EstimatedSalary":48818.32,"Exited":1},
    {"Year":2025,"CustomerId":15684171,"Surname":"Bianchi","CreditScore":660,"Geography":"Spain","Gender":"Female","Age":61,"Tenure":5,"Balance":155931.11,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":23461.92,"Exited":1},
    {"Year":2025,"CustomerId":15754849,"Surname":"Tyler","CreditScore":776,"Geography":"Germany","Gender":"Female","Age":32,"Tenure":4,"Balance":109421.13,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":173505.75,"Exited":0},
    {"Year":2025,"CustomerId":15602280,"Surname":"Martin","CreditScore":829,"Geography":"Germany","Gender":"Female","Age":27,"Tenure":9,"Balance":112045.67,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":169393.78,"Exited":0},
    {"Year":2025,"CustomerId":15771573,"Surname":"Okagbue","CreditScore":637,"Geography":"Germany","Gender":"Female","Age":39,"Tenure":9,"Balance":137843.8,"NumOfProducts":1,"HasCrCard":1,"IsActiveMember":1,"EstimatedSalary":103107.87,"Exited":0},
    {"Year":2025,"CustomerId":15766205,"Surname":"Yin","CreditScore":550,"Geography":"Germany","Gender":"Male","Age":38,"Tenure":2,"Balance":103391.38,"NumOfProducts":1,"HasCrCard":0,"IsActiveMember":1,"EstimatedSalary":82295.12,"Exited":0},
    {"Year":2025,"CustomerId":15771873,"Surname":"Buccho","CreditScore":776,"Geography":"Germany","Gender":"Female","Age":37,"Tenure":2,"Balance":103769.22,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":169364.52,"Exited":0},
    {"Year":2025,"CustomerId":15616550,"Surname":"Chidiebele","CreditScore":698,"Geography":"Germany","Gender":"Male","Age":44,"Tenure":10,"Balance":116363.37,"NumOfProducts":2,"HasCrCard":1,"IsActiveMember":0,"EstimatedSalary":27908.07,"Exited":0}
]

SURNAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell"
]

GEOGRAPHIES = ["France", "Spain", "Germany"]
GENDERS = ["Male", "Female"]

def generate_additional_customers():
    additional = []
    random.seed(42)
    
    for i in range(len(CUSTOMER_DATA), 800):
        age = random.randint(18, 78)
        geography = random.choice(GEOGRAPHIES)
        num_products = random.randint(1, 4)
        is_active = random.randint(0, 1)
        
        churn_base = 0.15
        if age > 50:
            churn_base += 0.15
        if geography == "Germany":
            churn_base += 0.1
        if num_products > 2:
            churn_base += 0.3
        if is_active == 0:
            churn_base += 0.1
        
        additional.append({
            "Year": 2025,
            "CustomerId": 15600000 + i,
            "Surname": random.choice(SURNAMES),
            "CreditScore": random.randint(350, 850),
            "Geography": geography,
            "Gender": random.choice(GENDERS),
            "Age": age,
            "Tenure": random.randint(0, 10),
            "Balance": round(random.random() * 200000, 2) if random.random() > 0.3 else 0,
            "NumOfProducts": num_products,
            "HasCrCard": 1 if random.random() > 0.3 else 0,
            "IsActiveMember": is_active,
            "EstimatedSalary": round(random.random() * 150000 + 30000, 2),
            "Exited": 1 if random.random() < churn_base else 0
        })
    
    return additional

ALL_CUSTOMERS = CUSTOMER_DATA + generate_additional_customers()

def get_all_customers():
    return ALL_CUSTOMERS

def get_customer_by_id(customer_id):
    for customer in ALL_CUSTOMERS:
        if customer["CustomerId"] == customer_id:
            return customer
    return None
