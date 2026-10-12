import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function JobCard({ job, onPress }) {
  if (!job) return null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>
            {job.company ? job.company.charAt(0).toUpperCase() : '💼'}
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {job.title || job.role || 'Job Opportunity'}
          </Text>
          <Text style={styles.company} numberOfLines={1}>
            {job.company || 'Company'} {job.location ? `• ${job.location}` : ''}
          </Text>
        </View>
        {job.matchScore && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{job.matchScore}% Match</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsRow}>
        {job.salary && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>💰 {job.salary}</Text>
          </View>
        )}
        {job.jobType && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>⏰ {job.jobType}</Text>
          </View>
        )}
        {job.experience && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>🎯 {job.experience} yrs</Text>
          </View>
        )}
      </View>

      {job.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
        <View style={styles.skillsRow}>
          {job.skills.slice(0, 4).map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      )}

      {job.description && (
        <Text style={styles.description} numberOfLines={2}>
          {job.description}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131c2d',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#3b82f640',
  },
  iconText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#60a5fa',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  company: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  badgeText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '800',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tagText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  skillText: {
    fontSize: 11,
    color: '#93c5fd',
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    lineHeight: 16,
  },
});
