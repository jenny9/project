import csv 

channel_list = [] 
channel = 'Ver'
channels = ['Ned1', 'Ned2', 'Ned3', 'NICK', 'RTL4', 'Ver', 'YRN', 'Tien', 'SBS 6']

for channel in channels:
	
		for j in range (2002, 2014):
		with open((str(i) + '.csv'), 'rb') as csvfile:
			lijst = csv.reader(csvfile, delimiter = ',', quotechar = '|')
			temp_list = []
			for row in lijst:
				if row[3] != "Channel":
					temp_list.append(row[3])

			channel_list.append(temp_list)
		
	total_list = [] 
	year = 2002 

	for element in channel_list:
		
		temp_list = []
		channel_count = 0

		for unit in element:

			if unit == channel:
				channel_count = channel_count + 1

		temp_list = [year, channel_count]
		
		total_list.append(temp_list)
		year = year + 1


	with open(channel +'.csv', 'wb') as output_file:
		writer = csv.writer(output_file)
		writer.writerow(['Jaar', 'Aantal'])
		
		for row in total_list:
			writer.writerow(row)

	i = i + 1