from boto.mturk.connection import MTurkConnection
from boto.mturk.question import ExternalQuestion
from boto.mturk.price import Price
from boto import mturk
from heapq import heappush, heappop

import boto3
import csv

AWS_ACCESS_KEY_ID = "###"
AWS_SECRET_ACCESS_KEY = "###"

HOST = 'mechanicalturk.amazonaws.com'

connection = MTurkConnection(aws_access_key_id=AWS_ACCESS_KEY_ID, 
	aws_secret_access_key=AWS_SECRET_ACCESS_KEY,host=HOST)

url = "https://powerful-inlet-12898.herokuapp.com/"
title = 'Arrange Some Adjectives on a Scale'
description = 'Arrange nodes representing adjectives on a scale according to relative intensity'
frame_height = 500
amount = .35

'''
def create_hit(attr):
	questionform = mturk.question.ExternalQuestion(url + '?attr=' + attr,frame_height)

	create_hit_result = connection.create_hit(
			title = title,
			description = description,
			question = questionform,
			max_assignments = 3,
			keywords = "adjective,language,english,slider,task,repeat,linguistics,word",
			reward = mturk.price.Price(amount= amount),
		)
	'''

#open file to write responses to
with open('mturk_responses.csv','w') as f:
	writer = csv.writer(f)
	writer.writerow(['WorkerId','AssignmentId','Approved?','attribute','answers'])
	print "searching..."
	assCount = 0
	count = 0
	unsubmittedCount = 0
	rejectionCount = 0
	attrCount = 0

	#reader = list(csv.reader(f))
	subCount = 0
	ticker = 1
	current_adj = ''
	'''
	with open('final_stims.csv','r') as ff:
		stim_reader = csv.reader(ff)
		for r in stim_reader:
			attribute = r[1].split('_')[0] + '_' +r[1].split('_')[1]
			submissions = [sub for sub in reader if sub[3] == attribute and sub[2] != 'rejected']
			print attribute
			print len(submissions)
			for x in xrange(3-len(submissions)):
				#create_hit(attribute)'''

	
	for hit in connection.get_all_hits():
		no_rejects = True
		reject_count = 0

		#if hit is mine
		if 'Arrange Some Adjectives' in hit.Title:
			#get assignments
			assignments = connection.get_assignments(hit.HITId)


			#if hit.NumberOfAssignmentsCompleted ==0:
				#connection.expire_hit(hit.HITId)

			#print hit.NumberOfAssignmentsCompleted
			if int(hit.NumberOfAssignmentsCompleted) == 0:
				no_rejects = False
			else:
				unsubmittedCount += 3- int(hit.NumberOfAssignmentsCompleted)
				attrCount += 0
			
			#collects and displays all adjectives ratings for a given HIT
			for ass in assignments:
				assCount +=1
				li = []
				#print ass.AssignmentStatus

				#print dir(ass)

				#approve_assignment(ass.AssignmentId,feedback="")
				#reject_assignment(ass.AssignmentId,feedback="")
				#grant_bonus(ass.WorkerId,ass.AssignmentId,get_price_as_price(0.5),reason='')
				#hit = connection.get_
				adjs = {}
				attr = ''
				
				for ans in ass.answers:
					#for a in ans:
						#print a.qid + ' : ' + a.fields[0]

					anss = [x for x in ans if '_' not in x.fields[0]]
					attrs = [x for x in ans if '_' in x.fields[0]]
					if attrs:
						attr = attrs[0].fields[0]
					else:
						attr = ''

					for a in anss:
						#print a.fields[0]

						index = int(a.fields[0])
						if index in adjs:
							adjs[index].append(a.qid.split('%')[0])
						else:
							adjs[index] = [a.qid.split('%')[0]]
						heappush(li,(int(a.fields[0]),a.qid.split('%')[0] +" : "+ a.fields[0]))

				#print ans[0].fields[0]
				for i in range(0,21):
					if i not in adjs:
						adjs[i] = []
					print str(i) +" : " + ','.join(map(str,adjs[i]))
				
				a_or_r = ''
				feedback = ''
				amt_rsn = ''


					
				#after displaying response data, asks user either reject or approve HIT, and whether to award bonus
				if(ass.AssignmentStatus == 'Submitted'):
					#print dir(ass)
					count += 1
					while True:
						#a_or_r = raw_input('Approve or Reject (a/r/pass)')
						if len(anss) <3:
							a_or_r = raw_input('Approve or Reject (a/r/pass)')
						else:
							a_or_r = 'a'

						feedback = ''
						if a_or_r.lower() in ['a','r','pass']:
							if a_or_r.lower() == 'a':
								#fb = raw_input('any feedback?')
								fb = ''
								connection.approve_assignment(ass.AssignmentId,feedback=fb)
								approve = 'a'
							if a_or_r.lower() == 'r':
								fb = raw_input('any feedback?')
								connection.reject_assignment(ass.AssignmentId, feedback = fb)
								approve = 'r'
							else:
								approve = 'pass'
						else:
							continue
						#bonus = raw_input('grant bonus? (y/n)')
						bonus = 'n'
						amount = 0.0
						reason = 'n/a'
						if bonus.lower() in ['y','n']:
							if bonus.lower() == 'y':
								amount = float(raw_input('Input a decimal amount to pay (0.00)'))
								reason = raw_input('include a reason for the bonus, if necessary: ')
								if not reason:
									reason = 'n/a'
								amt_rsn = (amount,reason)
								print amt_rsn
								connection.grant_bonus(ass.WorkerId,ass.AssignmentId,connection.get_price_as_price(amount),reason)
							else: 
								amt_rsn = ''
						else: 
							amt_rsn = ''
						break



					
							#heappush(li,(int(a.fields[0]),a.qid.split('%')[0] +" : "+ a.fields[0]))
				if hasattr(ass,'ApprovalTime'):
					approved = 'approved'

				if hasattr(ass,'RejectionTime'):
					approved = 'rejected'
					reject_count += 1
					no_rejects = False
				
				writer.writerow([ass.WorkerId,ass.AssignmentId,approved,attr] + [heappop(li)[1] for i in range(len(li))])
			if no_rejects and int(hit.NumberOfAssignmentsCompleted) == 3:
				attrCount += 1
			extend = 0
			if int(hit.NumberOfAssignmentsCompleted) < 3:
				#connection.extend_hit(hit.HITId,expiration_increment=259200)
				print 'number ' + hit.NumberOfAssignmentsCompleted
			if reject_count > 0:
				#connection.extend_hit(hit.HITId,expiration_increment=259200)
				#connection.extend_hit(hit.HITId,reject_count)
				print str(extend) + ' : ' + str(reject_count)
			reject_count = 0
			

	print count

'''

with open('final_stims.csv','rb') as f:
	reader = csv.reader(f)
	
	for row in reader:
		attr = row[1].split('_')[0] + '_' + row[1].split('_')[1]
		questionform = mturk.question.ExternalQuestion(url + '?attr=' + attr,frame_height)


		create_hit_result = connection.create_hit(
			title = title,
			description = description,
			question = questionform,
			max_assignments = 3,
			keywords = "adjective,language,english,slider,task,repeat,linguistics,word",
			reward = mturk.price.Price(amount= amount),
		)

'''